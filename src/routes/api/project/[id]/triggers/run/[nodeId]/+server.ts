import {json, error} from '@sveltejs/kit';

import {insertLog} from '../../log';
import {importServerPlugins, ServerGraphContext} from '$lib/core/core.server';
import type {Graph} from '$lib/core/core';
import type {RequestEvent} from './$types';

const handler = async ({locals, params, request}: RequestEvent) => {
    const trigger = await locals.db.selectFrom('public.triggers').where('node_id', '=', params.nodeId).where('project_id', '=', params.id).executeTakeFirst();
    if (!trigger) throw error(404);

    const project = await locals.db.selectFrom('public.projects').select(['id', 'content', 'owner_id']).where('id', '=', params.id).executeTakeFirst();
    if (!project) throw error(404);

    const {content, owner_id} = project;
    const {nodes, edges} = content as Graph;

    const execId = crypto.randomUUID();
    const controller = new AbortController();
    const serverNodes = ServerGraphContext.fromNodes(nodes);
    const serverEdges = ServerGraphContext.fromEdges(edges);
    const {serverActions, serverTriggers} = await importServerPlugins();

    let index = 0;
    const secrets = (await locals.db.selectFrom('public.secrets').select(['key', 'value']).where('owner_id', '=', owner_id).execute()).reduce(
        (acc, {key, value}) => ({
            ...acc,
            [key]: value,
        }),
        {},
    );
    const context = new ServerGraphContext({secrets, serverNodes, serverEdges, serverActions, serverTriggers});

    for await (const step of context.executeTrigger({node: context.getServerNode(params.nodeId), signal: controller.signal, request})) {
        insertLog(locals.db, {
            execId,
            nodeId: step.nodeId,
            pluginId: step.pluginId,
            projectId: params.id,
            //
            index: index++,
            config: step.config,
            results: step.results,
        });
    }

    return json({index});
};

export const GET = handler;
export const HEAD = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
