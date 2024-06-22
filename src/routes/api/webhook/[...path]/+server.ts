import {json} from '@sveltejs/kit';
import {writable} from 'svelte/store';

import {GraphContext} from '$lib/core/core';
import {executeTrigger} from '$lib/core/core.server';
import {loadPlugins, loadServerPlugins} from '$lib/helper/plugin';

import type {Db} from '$lib/supabase/db.server';
import type {Graph} from '$lib/core/core';
import type {TriggerNode} from '$lib/core/graph/nodes';

const execute = async (db: Db, path: string, method: string) => {
    const plugins = await loadPlugins();
    const projects = await db.selectFrom('projects').select('content').execute();
    const serverPlugins = await loadServerPlugins();

    for (const {content} of projects) {
        const {nodes, edges} = content as Graph;
        const webhooks = nodes.filter(n => n.type === 'trigger' && n.data.id === 'webhook:webhook') as TriggerNode[];

        if (webhooks) {
            const context = new GraphContext({nodes: writable(nodes), edges: writable(edges), actions: plugins.actions, triggers: plugins.triggers});

            for (const webhook of webhooks) {
                const webhookPath = webhook.data.data.config.value.path as string;
                const webhookMethod = webhook.data.data.config.value.method as string;

                if ((path === webhookPath || (path === '' && webhookPath === '/')) && method === webhookMethod) {
                    for await (const step of executeTrigger({out: 'out', node: webhook, context, serverActions: serverPlugins.actions, serverTriggers: serverPlugins.triggers})) {
                        console.log(step);
                    }
                }
            }
        }
    }
    return json({});
};

export const GET = ({locals, params}) => execute(locals.db, params.path, 'GET');
export const POST = ({locals, params}) => execute(locals.db, params.path, 'POST');
export const PATCH = ({locals, params}) => execute(locals.db, params.path, 'PATCH');
export const DELETE = ({locals, params}) => execute(locals.db, params.path, 'DELETE');
