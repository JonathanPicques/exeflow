import {error} from '@sveltejs/kit';
import {writable} from 'svelte/store';
import {randomUUID} from 'crypto';

import {valid} from '$lib/schema/validate';
import {insertLog} from '../../log';
import {GraphContext, importPlugins} from '$lib/core/core';
import {executeTrigger, importServerPlugins} from '$lib/core/core.server';
import type {Db} from '$lib/supabase/db.server';
import type {Graph} from '$lib/core/core';
import type {TriggerNode} from '$lib/core/graph/nodes';

import type {ProjectsId} from '$lib/supabase/gen/public/Projects';

const execute = async (db: Db, id: string, request: Request, path: string, method: string) => {
    const project = await db
        .selectFrom('projects')
        .select(['content', 'owner_id'])
        .where('id', '=', id as ProjectsId)
        .limit(1)
        .executeTakeFirst();
    if (!project) throw error(404);

    const execId = randomUUID();
    const {actions, triggers} = await importPlugins();
    const {serverActions, serverTriggers} = await importServerPlugins();

    const controller = new AbortController();
    const responseStream = new ReadableStream({
        async start(stream) {
            try {
                let index = 0;

                const {nodes, edges} = project.content as Graph;
                const webhooks = nodes.filter(n => n.type === 'trigger' && n.data.id === 'webhook:webhook') as TriggerNode[];

                if (webhooks) {
                    const context = new GraphContext({nodes: writable(nodes), edges: writable(edges), actions, triggers});
                    const secrets = (await db.selectFrom('secrets').select(['key', 'value']).where('owner_id', '=', project.owner_id).execute()).reduce(
                        (acc, {key, value}) => ({
                            ...acc,
                            [key]: value,
                        }),
                        {},
                    );

                    for (const webhook of webhooks) {
                        const webhookPath = webhook.data.data.config.value.path as string;
                        const webhookMethod = webhook.data.data.config.value.method as string;

                        if ((path === webhookPath || (path === '' && webhookPath === '/')) && method === webhookMethod) {
                            for await (const step of executeTrigger({node: webhook, signal: controller.signal, context, secrets, request, serverActions, serverTriggers})) {
                                if (controller.signal.aborted) return;
                                if (step.pluginId === 'webhook:header' && valid(step.config, {type: 'object', required: ['headers'], properties: {headers: {}}})) {
                                    console.log('merge headers', step.config.headers);
                                }
                                if (step.pluginId === 'webhook:response' && valid(step.config, {type: 'object', required: ['body'], properties: {body: {}}})) {
                                    stream.enqueue(step.config.body);
                                }
                                insertLog(db, {
                                    execId,
                                    nodeId: step.nodeId,
                                    pluginId: step.pluginId,
                                    projectId: id,
                                    //
                                    index: index++,
                                    config: step.config,
                                    results: step.results,
                                });
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

export const GET = ({locals, params, request}) => execute(locals.db, params.id, request, `/${params.path}`, 'GET');
export const HEAD = ({locals, params, request}) => execute(locals.db, params.id, request, `/${params.path}`, 'HEAD');
export const POST = ({locals, params, request}) => execute(locals.db, params.id, request, `/${params.path}`, 'POST');
export const PATCH = ({locals, params, request}) => execute(locals.db, params.id, request, `/${params.path}`, 'PATCH');
export const DELETE = ({locals, params, request}) => execute(locals.db, params.id, request, `/${params.path}`, 'DELETE');
export const OPTIONS = ({locals, params, request}) => execute(locals.db, params.id, request, `/${params.path}`, 'OPTIONS');
