import {error} from '@sveltejs/kit';
import {writable} from 'svelte/store';

import {valid} from '$lib/schema/validate';
import {isTriggerNode} from '$lib/core/graph/nodes';
import {executeTrigger, importServerPlugins} from '$lib/core/core.server';
import {graphSchema, GraphContext, importPlugins} from '$lib/core/core';

export const POST = async ({locals, params, request}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const graph = await request.json();

    if (valid(graph, graphSchema)) {
        const {actions, triggers} = await importPlugins();
        const {serverActions, serverTriggers} = await importServerPlugins();

        const context = new GraphContext({nodes: writable(graph.nodes), edges: writable(graph.edges), actions, triggers});
        const secrets = (await locals.db.selectFrom('secrets').select(['key', 'value']).where('owner_id', '=', user.id).execute()).reduce(
            (acc, {key, value}) => ({
                ...acc,
                [key]: value,
            }),
            {},
        );

        const controller = new AbortController();
        const responseStream = new ReadableStream({
            async start(stream) {
                try {
                    const node = context.findNode(params.nodeId);
                    if (!isTriggerNode(node)) throw new Error(`cannot execute an action`);
                    for await (const step of executeTrigger({node, signal: controller.signal, context, secrets, serverActions, serverTriggers})) {
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
