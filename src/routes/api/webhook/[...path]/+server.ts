import {error} from '@sveltejs/kit';
import {writable} from 'svelte/store';

import {valid} from '$lib/schema/validate';
import {GraphContext} from '$lib/core/core';
import {executeTrigger} from '$lib/core/core.server';
import {loadPlugins, loadServerPlugins} from '$lib/helper/plugin';
import type {Db} from '$lib/supabase/db.server';
import type {Graph} from '$lib/core/core';
import type {TriggerNode} from '$lib/core/graph/nodes';
import type {TriggersPluginId} from '$lib/supabase/gen/public/Triggers';

const execute = async (db: Db, request: Request, path: string, method: string) => {
    const triggers = await db
        .selectFrom('triggers')
        .select('project_id')
        .where('query', '=', `${method} ${path}`)
        .where('plugin_id', '=', 'webhook:webhook' as TriggersPluginId)
        .execute();
    if (triggers.length === 0) throw error(404);

    const triggerProjectIds = triggers.map(t => t.project_id);
    const projects = await db.selectFrom('projects').select('content').where('id', 'in', triggerProjectIds).execute();
    if (projects.length === 0) throw error(404);

    const plugins = await loadPlugins();
    const serverPlugins = await loadServerPlugins();

    const controller = new AbortController();
    const responseStream = new ReadableStream({
        async start(stream) {
            try {
                for (const {content} of projects) {
                    const {nodes, edges} = content as Graph;
                    const webhooks = nodes.filter(n => n.type === 'trigger' && n.data.id === 'webhook:webhook') as TriggerNode[];

                    if (webhooks) {
                        const context = new GraphContext({nodes: writable(nodes), edges: writable(edges), actions: plugins.actions, triggers: plugins.triggers});

                        for (const webhook of webhooks) {
                            const webhookPath = webhook.data.data.config.value.path as string;
                            const webhookMethod = webhook.data.data.config.value.method as string;

                            if ((path === webhookPath || (path === '' && webhookPath === '/')) && method === webhookMethod) {
                                for await (const step of executeTrigger({
                                    node: webhook,
                                    signal: controller.signal,
                                    context,
                                    request,
                                    serverActions: serverPlugins.actions,
                                    serverTriggers: serverPlugins.triggers,
                                })) {
                                    if (controller.signal.aborted) return;
                                    if (step.node.pluginId === 'webhook:response' && valid(step.node.config, {type: 'object', required: ['data'], properties: {data: {}}})) {
                                        stream.enqueue(step.node.config.data);
                                    }
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

export const GET = ({locals, params, request}) => execute(locals.db, request, params.path || '/', 'GET');
export const POST = ({locals, params, request}) => execute(locals.db, request, params.path || '/', 'POST');
export const PATCH = ({locals, params, request}) => execute(locals.db, request, params.path || '/', 'PATCH');
export const DELETE = ({locals, params, request}) => execute(locals.db, request, params.path || '/', 'DELETE');
