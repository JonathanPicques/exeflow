import {error} from '@sveltejs/kit';
import {writable} from 'svelte/store';

import {valid} from '$lib/schema/validate';
import {insertLog} from '../../log';
import {GraphContext, importPlugins} from '$lib/core/core';
import {executeTrigger, importServerPlugins} from '$lib/core/core.server';
import type {Graph} from '$lib/core/core';
import type {ProjectsId} from '$lib/supabase/gen/public/Projects';
import type {JsonSchema} from '$lib/schema/schema';
import type {TriggerNode} from '$lib/core/graph/nodes';
import type {RequestEvent} from './$types';

const chunkSchema = {
    type: 'object',
    required: ['body'],
    properties: {
        body: {},
    },
} satisfies JsonSchema;
const statusSchema = {
    type: 'object',
    required: ['status'],
    properties: {
        status: {type: 'number'},
    },
} satisfies JsonSchema;
const headerSchema = {
    type: 'object',
    required: ['headers'],
    properties: {
        headers: {
            type: 'object',
            additionalProperties: {type: 'string'},
        },
    },
} satisfies JsonSchema;
const responseSchema = {
    type: 'object',
    required: ['body', 'status', 'headers'],
    properties: {
        body: {},
        status: {type: 'number'},
        headers: {
            type: 'object',
            additionalProperties: {type: 'string'},
        },
    },
} satisfies JsonSchema;

const handler = async ({locals, params, request}: RequestEvent) => {
    const path = `/${params.path}`;
    const method = request.method;
    const project = await locals.db
        .selectFrom('projects')
        .select(['content', 'owner_id'])
        .where('id', '=', params.id as ProjectsId)
        .limit(1)
        .executeTakeFirst();
    if (!project) throw error(404);

    let index = 0;
    const execId = crypto.randomUUID();
    const {actions, triggers} = await importPlugins();
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

    const context = new GraphContext({nodes: writable(nodes), edges: writable(edges), actions, triggers});
    const secrets = (await locals.db.selectFrom('secrets').select(['key', 'value']).where('owner_id', '=', project.owner_id).execute()).reduce(
        (acc, {key, value}) => ({
            ...acc,
            [key]: value,
        }),
        {},
    );
    const controller = new AbortController();
    const webhookGenerator = executeTrigger({node: suitableWebhook, signal: controller.signal, context, secrets, request, serverActions, serverTriggers});

    let iterator = webhookGenerator.next();
    while (!(await iterator).done) {
        const step = (await iterator).value;
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
                        if (valid(step.config, chunkSchema)) {
                            stream.enqueue(step.config.body);
                        }

                        while (!(await iterator).done) {
                            const step = (await iterator).value;
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

                            if (step.pluginId === 'webhook:chunk' && valid(step.config, chunkSchema)) {
                                stream.enqueue(step.config.body);
                            }
                            if (step.pluginId === 'webhook:status' && valid(step.config, statusSchema)) {
                                console.warn('status already sent');
                            }
                            if (step.pluginId === 'webhook:headers' && valid(step.config, headerSchema)) {
                                console.warn('headers already sent');
                            }
                            if (step.pluginId === 'webhook:response' && valid(step.config, responseSchema)) {
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
                    'content-type': 'text/event-stream',
                },
            });
        }
        if (step.pluginId === 'webhook:status' && valid(step.config, statusSchema)) {
            status = step.config.status;
        }
        if (step.pluginId === 'webhook:headers' && valid(step.config, headerSchema)) {
            headers = Object.assign({}, headers, step.config.headers);
        }
        if (step.pluginId === 'webhook:response' && valid(step.config, responseSchema)) {
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
