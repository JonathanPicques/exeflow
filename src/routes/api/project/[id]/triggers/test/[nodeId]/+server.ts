import {error} from '@sveltejs/kit';

import {parseBody} from '$lib/core/helper/body';
import {graphSchema} from '$lib/core/core';
import {ServerGraphContext, importServerPlugins} from '$lib/core/core.server';

// TODO: instead of taking a graph, we should take a server graph
export const POST = async ({locals, params, request}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const req = request.clone();
    const body = await parseBody(request, graphSchema);
    if (body.error) throw error(400, body.error.message);

    const serverNodes = ServerGraphContext.fromNodes(body.data.nodes);
    const serverEdges = ServerGraphContext.fromEdges(body.data.edges);
    const {serverActions, serverTriggers} = await importServerPlugins();

    const secrets = (await locals.db.selectFrom('public.secrets').select(['key', 'value']).where('owner_id', '=', user.id).execute()).reduce(
        (acc, {key, value}) => ({
            ...acc,
            [key]: value,
        }),
        {},
    );
    const context = new ServerGraphContext({secrets, serverNodes, serverEdges, serverActions, serverTriggers});
    const controller = new AbortController();
    const responseStream = new ReadableStream({
        async start(stream) {
            try {
                const node = context.getServerNode(params.nodeId);
                for await (const step of context.executeTrigger({node, signal: controller.signal, request: req})) {
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
            Connection: 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
        },
    });
};
