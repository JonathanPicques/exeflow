import {error} from '@sveltejs/kit';
import {writable} from 'svelte/store';

import {valid} from '$lib/schema/validate';
import {isTriggerNode} from '$lib/core/graph/nodes';
import {executeTrigger} from '$lib/core/core.server';
import {graphSchema, GraphContext} from '$lib/core/core';
import {loadPlugins, loadServerPlugins} from '$lib/helper/plugin';

export const POST = async ({locals, params, request}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const id = params.id;
    const graph = await request.json();

    if (valid(graph, graphSchema)) {
        const plugins = await loadPlugins();
        const context = new GraphContext({nodes: writable(graph.nodes), edges: writable(graph.edges), actions: plugins.actions, triggers: plugins.triggers});
        const controller = new AbortController();
        const serverPlugins = await loadServerPlugins();

        const responseStream = new ReadableStream({
            async start(stream) {
                try {
                    const node = context.findNode(id);
                    if (!isTriggerNode(node)) throw new Error(`can not execute an action`);
                    for await (const step of executeTrigger({
                        node,
                        signal: controller.signal,
                        context,
                        serverActions: serverPlugins.actions,
                        serverTriggers: serverPlugins.triggers,
                    })) {
                        if (controller.signal.aborted) return;
                        stream.enqueue(JSON.stringify(step));
                        stream.enqueue('\n');
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
    }
    throw error(400);
};
