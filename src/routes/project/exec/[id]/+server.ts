import {error} from '@sveltejs/kit';
import {writable} from 'svelte/store';

import {valid} from '$lib/schema/validate';
import {graphSchema, GraphContext} from '$lib/core/core';
import {loadPlugins, loadServerPlugins} from '$lib/helper/plugin';
import type {ActionNode} from '$lib/core/graph/nodes';

export const POST = async ({params, request}) => {
    const id = params.id;
    const graph = await request.json();

    if (valid(graph, graphSchema)) {
        const plugins = await loadPlugins();
        const serverPlugins = await loadServerPlugins();
        const {findNextActionNode} = new GraphContext({nodes: writable(graph.nodes), edges: writable(graph.edges), actions: plugins.actions, triggers: plugins.triggers});

        const controller = new AbortController();
        const responseStream = new ReadableStream({
            async start(controller) {
                const execute = async function* (node: ActionNode): AsyncGenerator<{out?: string; results: Record<string, unknown>}> {
                    const serverAction = serverPlugins.actions[node.data.id];
                    if (!serverAction) throw new Error(`server action ${node.data.id} not found`);
                    const generator = serverAction.exec({config: node.data.data.config});

                    while (true) {
                        const {done, value} = await generator.next();
                        yield value;
                        if (value.out) {
                            const next = findNextActionNode(node.id, value.out);
                            if (next) {
                                yield* execute(next);
                            }
                        }
                        if (done) break;
                    }
                };

                try {
                    const node = findNextActionNode(id, 'out');
                    if (!node) throw new Error(`node ${id} not found`);

                    for await (const step of execute(node)) {
                        controller.enqueue(JSON.stringify(step));
                        controller.enqueue('\n');
                    }
                } catch (e) {
                    console.error(e);
                    controller.error(e);
                } finally {
                    controller.close();
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
    throw error(400, 'invalid body');
};
