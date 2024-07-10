import {error} from '@sveltejs/kit';
import {writable} from 'svelte/store';
import {randomUUID} from 'crypto';

import {valid} from '$lib/schema/validate';
import {GraphContext, importPlugins} from '$lib/core/core';
import {executeTrigger, importServerPlugins} from '$lib/core/core.server';
import type {Db} from '$lib/supabase/db.server';
import type {Graph} from '$lib/core/core';
import type {TriggerNode} from '$lib/core/graph/nodes';

import type {ProjectsId} from '$lib/supabase/gen/public/Projects';
import type {TriggersPluginId} from '$lib/supabase/gen/public/Triggers';
import type {LogsExecId, LogsNodeId, LogsPluginId} from '$lib/supabase/gen/public/Logs';

const log = (db: Db, index: number, execId: string, nodeId: string, pluginId: string, projectId: string, config: unknown, results: unknown) => {
    db.insertInto('logs')
        .values({
            exec_id: execId as LogsExecId,
            node_id: nodeId as LogsNodeId,
            plugin_id: pluginId as LogsPluginId,
            project_id: projectId as ProjectsId,
            //
            index,
            config,
            results,
            //
            created_at: new Date(),
        })
        .execute()
        .catch(e => {
            console.error('failed to log', e); // silently ignore
        });
};

const execute = async (db: Db, request: Request, path: string, method: string) => {
    const triggerRows = await db
        .selectFrom('triggers')
        .select('project_id')
        .where('plugin_id', '=', 'webhook:webhook' as TriggersPluginId)
        .where(e => e.ref('config', '->').key('value').key('path'), '=', JSON.stringify(path))
        .where(e => e.ref('config', '->').key('value').key('method'), '=', JSON.stringify(method))
        .execute();
    if (triggerRows.length === 0) throw error(404);

    const triggerProjectIds = triggerRows.map(t => t.project_id);
    const projects = await db.selectFrom('projects').select(['id', 'content']).where('id', 'in', triggerProjectIds).execute();
    if (projects.length === 0) throw error(404);

    const executionId = randomUUID();
    const {actions, triggers} = await importPlugins();
    const {serverActions, serverTriggers} = await importServerPlugins();

    const controller = new AbortController();
    const responseStream = new ReadableStream({
        async start(stream) {
            try {
                let index = 0;
                for (const {id: projectId, content} of projects) {
                    const {nodes, edges} = content as Graph;
                    const webhooks = nodes.filter(n => n.type === 'trigger' && n.data.id === 'webhook:webhook') as TriggerNode[];

                    if (webhooks) {
                        const context = new GraphContext({nodes: writable(nodes), edges: writable(edges), actions, triggers});

                        for (const webhook of webhooks) {
                            const webhookPath = webhook.data.data.config.value.path as string;
                            const webhookMethod = webhook.data.data.config.value.method as string;

                            if ((path === webhookPath || (path === '' && webhookPath === '/')) && method === webhookMethod) {
                                for await (const step of executeTrigger({node: webhook, signal: controller.signal, context, request, serverActions, serverTriggers})) {
                                    if (controller.signal.aborted) return;
                                    if (step.pluginId === 'webhook:response' && valid(step.config, {type: 'object', required: ['data'], properties: {data: {}}})) {
                                        stream.enqueue(step.config.data);
                                    }
                                    log(db, index++, executionId, step.nodeId, step.pluginId, projectId, step.config, step.results);
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                stream.error(e);
                console.error(e);
            } finally {
                stream.close();
            }
        },
        cancel() {
            controller.abort();
        },
    });

    return new Response(responseStream, {
        headers: {
            'content-type': 'text/event-stream',
        },
    });
};

export const GET = ({locals, params, request}) => execute(locals.db, request, `/${params.path}`, 'GET');
export const HEAD = ({locals, params, request}) => execute(locals.db, request, `/${params.path}`, 'HEAD');
export const POST = ({locals, params, request}) => execute(locals.db, request, `/${params.path}`, 'POST');
export const PATCH = ({locals, params, request}) => execute(locals.db, request, `/${params.path}`, 'PATCH');
export const DELETE = ({locals, params, request}) => execute(locals.db, request, `/${params.path}`, 'DELETE');
export const OPTIONS = ({locals, params, request}) => execute(locals.db, request, `/${params.path}`, 'OPTIONS');
