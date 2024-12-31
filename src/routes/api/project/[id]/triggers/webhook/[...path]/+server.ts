import {z} from 'zod';
import {error} from '@sveltejs/kit';

import {insertLog} from '../../log';
import {ServerGraphContext, importServerPlugins} from '$lib/core/core.server';
import type {RequestHandler} from './$types';
import type {Graph, TriggerNode} from '$lib/core/core';

const is = <T extends z.Schema>(data: unknown, schema: T): data is z.infer<T> => {
    return schema.safeParse(data).success;
};
const chunkSchema = z.object({
    body: z.any(),
});
const statusSchema = z.object({
    status: z.number(),
});
const headersSchema = z.object({
    headers: z.record(z.string()),
});
const responseSchema = z.object({
    body: z.any(),
    status: z.number(),
    headers: z.record(z.string()),
});
const executeStepSchema = z.object({
    config: z.union([responseSchema, headersSchema, statusSchema, chunkSchema]),
    nodeId: z.string(),
    results: z.record(z.string(), z.unknown()),
    pluginId: z.string(),
});

const handler: RequestHandler = async ({locals, params, request}) => {
    const path = `/${params.path}`;
    const method = request.method;
    const project = await locals.db.selectFrom('public.projects').select(['content', 'owner_id']).where('id', '=', params.id).limit(1).executeTakeFirst();
    if (!project) throw error(404);

    let index = 0;
    const execId = crypto.randomUUID();
    const {serverActions, serverTriggers} = await importServerPlugins();

    let body;
    let status = 200;
    let headers: Record<string, string> = {};

    const {nodes, edges} = project.content as Graph;
    const webhooks = nodes.filter(n => n.type === 'trigger' && n.data.id === 'webhook:webhook') as TriggerNode[];
    const suitableWebhook = webhooks.find(({data}) => {
        const webhookPath = data.data.config.value.path as string;
        const webhookMethod = data.data.config.value.method as string;

        return (path === webhookPath || (path === '' && webhookPath === '/')) && method === webhookMethod;
    });
    if (!suitableWebhook) return error(404, `no handler found for ${path}`);
    const serverNodes = ServerGraphContext.fromNodes(nodes);
    const serverEdges = ServerGraphContext.fromEdges(edges);
    const serverSuitableWebhook = serverNodes[suitableWebhook.id];
    if (!serverSuitableWebhook) return error(404, `no handler found for ${path}`);

    const secrets = (await locals.db.selectFrom('public.secrets').select(['key', 'value']).where('owner_id', '=', project.owner_id).execute()).reduce(
        (acc, {key, value}) => ({
            ...acc,
            [key]: value,
        }),
        {},
    );
    const context = new ServerGraphContext({secrets, serverNodes, serverEdges, serverActions, serverTriggers});
    const controller = new AbortController();
    const webhookGenerator = context.executeTrigger({node: serverSuitableWebhook, signal: controller.signal, request});

    let iterator = webhookGenerator.next();
    while (!(await iterator).done) {
        const step = executeStepSchema.parse((await iterator).value);
        iterator = webhookGenerator.next();

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

        if (step.pluginId === 'webhook:chunk') {
            const responseStream = new ReadableStream({
                async start(stream) {
                    try {
                        if (is(step.config, chunkSchema)) {
                            stream.enqueue(step.config.body);
                        }

                        while (!(await iterator).done) {
                            const step = executeStepSchema.parse((await iterator).value);
                            iterator = webhookGenerator.next();

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

                            if (step.pluginId === 'webhook:chunk' && is(step.config, chunkSchema)) {
                                stream.enqueue(step.config.body);
                            }
                            if (step.pluginId === 'webhook:status' && is(step.config, statusSchema)) {
                                console.warn('status already sent');
                            }
                            if (step.pluginId === 'webhook:headers' && is(step.config, headersSchema)) {
                                console.warn('headers already sent');
                            }
                            if (step.pluginId === 'webhook:response' && is(step.config, responseSchema)) {
                                console.warn('use chunk instead of response');
                                stream.enqueue(step.config.body);
                                controller.abort();
                                break;
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
                status,
                headers: {
                    ...headers,
                    Connection: 'keep-alive',
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                },
            });
        }
        if (step.pluginId === 'webhook:status' && is(step.config, statusSchema)) {
            status = step.config.status;
        }
        if (step.pluginId === 'webhook:headers' && is(step.config, headersSchema)) {
            headers = Object.assign({}, headers, step.config.headers);
        }
        if (step.pluginId === 'webhook:response' && is(step.config, responseSchema)) {
            body = step.config.body;
            status = step.config.status;
            headers = Object.assign({}, headers, step.config.headers);
            controller.abort();
            return new Response(body, {status, headers});
        }
    }

    return new Response(null, {status, headers});
};

export const GET = handler;
export const HEAD = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
