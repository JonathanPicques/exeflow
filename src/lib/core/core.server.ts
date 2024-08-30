import * as env from '$env/static/private';

import {resolve} from '$lib/helper/parse';
import type {ActionId} from '$lib/core/plugins/action';
import type {TriggerId} from '$lib/core/plugins/trigger';
import type {JsonSchema} from '$lib/schema/schema';
import type {ServerAction} from '$lib/core/plugins/action.server';
import type {ServerTrigger} from '$lib/core/plugins/trigger.server';
import type {PluginId, GraphContext} from '$lib/core/core';
import type {PluginNode, ActionNode, TriggerNode} from '$lib/core/graph/nodes';

interface ExecuteData {
    [K: PluginNode['id']]: Record<string, unknown>;
}

interface ExecuteStep {
    nodeId: PluginNode['id'];
    pluginId: PluginId;
    config: unknown;
    results: Record<string, unknown>;
}

interface ActionExecuteArgs<T extends PluginNode> {
    node: T;
    input: string;
    signal: AbortSignal;
    context: GraphContext;
    secrets: Record<string, string>;
    serverActions: Record<ActionId, ServerAction<JsonSchema>>;
}

interface TriggerExecuteArgs<T extends PluginNode> {
    node: T;
    signal: AbortSignal;
    context: GraphContext;
    secrets: Record<string, string>;
    request?: Request;
    serverActions: Record<ActionId, ServerAction<JsonSchema>>;
    serverTriggers: Record<TriggerId, ServerTrigger<JsonSchema>>;
}

export const executeAction = async function* (
    {node, input, signal, context, secrets, serverActions}: ActionExecuteArgs<ActionNode>,
    data: ExecuteData = {},
): AsyncGenerator<ExecuteStep> {
    const serverAction = serverActions[node.data.id];
    if (!serverAction) throw new Error(`server action ${node.data.id} not found`);

    const config = resolve(node.data.data.config.value, node.data.data.config.schema, {env, node: data, secrets});

    yield* serverAction.exec({
        next: async function* ({output: out, results}) {
            data[node.id] = results;
            yield {nodeId: node.id, pluginId: node.data.id, config, results};

            const nextNode = context.findNextActionNode(node.id, out);
            if (nextNode) {
                yield* executeAction({node: nextNode.node, input: nextNode.input, signal, context, secrets, serverActions}, data);
            }
        },
        input,
        //
        config,
        signal,
    });
};

export const executeTrigger = async function* ({
    node,
    signal,
    context,
    secrets,
    request,
    serverActions,
    serverTriggers,
}: TriggerExecuteArgs<TriggerNode>): AsyncGenerator<ExecuteStep> {
    const serverTrigger = serverTriggers[node.data.id];
    if (!serverTrigger) throw new Error(`server trigger ${node.data.id} not found`);

    const data: ExecuteData = {};
    const config = resolve(node.data.data.config.value, node.data.data.config.schema, {env, node: data, secrets});

    yield* serverTrigger.exec({
        next: async function* ({output: out, results}) {
            data[node.id] = results;
            yield {nodeId: node.id, pluginId: node.data.id, config, results};

            const nextNode = context.findNextActionNode(node.id, out);
            if (nextNode) {
                yield* executeAction({node: nextNode.node, input: nextNode.input, signal, context, secrets, serverActions}, data);
            }
        },
        //
        config,
        signal,
        request,
    });
};

export const importServerPlugins = async () => {
    const serverActions: Record<ActionId, ServerAction<JsonSchema>> = {};
    const serverTriggers: Record<TriggerId, ServerTrigger<JsonSchema>> = {};
    const serverPluginModules = import.meta.glob('$lib/plugins/**/*.server.ts', {eager: true, import: 'default'});

    for (const [path, module] of Object.entries(serverPluginModules)) {
        const id = path.replace('/src/lib/plugins/', '').replace('/', ':').replace('.server.ts', '');
        const plugin = module as ServerAction<JsonSchema> | ServerTrigger<JsonSchema>;

        switch (plugin.type) {
            case 'serverAction':
                serverActions[id] = plugin;
                break;
            case 'serverTrigger':
                serverTriggers[id] = plugin;
                break;
            default:
                throw new Error(`malformed server plugin ${id}`);
        }
    }
    return {serverActions, serverTriggers};
};
