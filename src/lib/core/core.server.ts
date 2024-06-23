import * as env from '$env/static/private';

import {resolve} from '$lib/helper/parse';
import type {ActionId} from '$lib/core/plugins/action';
import type {TriggerId} from '$lib/core/plugins/trigger';
import type {JsonSchema} from '$lib/schema/schema';
import type {ServerAction} from '$lib/core/plugins/action.server';
import type {ServerTrigger} from '$lib/core/plugins/trigger.server';
import type {Plugin, PluginId, GraphContext} from '$lib/core/core';
import type {PluginNode, ActionNode, TriggerNode} from '$lib/core/graph/nodes';

interface ExecuteData {
    [K: PluginNode['id']]: Record<string, unknown>;
}

interface ExecuteStep {
    out?: string;
    node: {
        id: PluginNode['id'];
        config: unknown;
        pluginId: PluginId;
        pluginType: Plugin['type'];
    };
    first?: boolean;
    results: Record<string, unknown>;
}

interface ActionExecuteArgs<T extends PluginNode> {
    node: T;
    context: GraphContext;
    serverActions: Record<ActionId, ServerAction<JsonSchema>>;
}

interface TriggerExecuteArgs<T extends PluginNode> {
    node: T;
    context: GraphContext;
    request?: Request;
    serverActions: Record<ActionId, ServerAction<JsonSchema>>;
    serverTriggers: Record<TriggerId, ServerTrigger<JsonSchema>>;
}

export const executeAction = async function* ({node, context, serverActions}: ActionExecuteArgs<ActionNode>, data: ExecuteData = {}): AsyncGenerator<ExecuteStep> {
    const serverAction = serverActions[node.data.id];
    if (!serverAction) throw new Error(`server action ${node.data.id} not found`);
    const config = resolve(node.data.data.config.value, node.data.data.config.schema, {env, node: data});
    const generator = serverAction.exec({config});

    while (true) {
        const {done, value} = await generator.next();
        yield {
            node: {
                id: node.id,
                config,
                pluginId: node.data.id,
                pluginType: node.type,
            },
            first: true,
            ...value,
        };
        data[node.id] = value.results;
        if (value.out) {
            const next = context.findNextActionNode(node.id, value.out);
            if (next) {
                yield* executeAction({node: next, context, serverActions}, data);
            }
        }
        if (done) break;
    }
};

export const executeTrigger = async function* ({node, context, request, serverActions, serverTriggers}: TriggerExecuteArgs<TriggerNode>): AsyncGenerator<ExecuteStep> {
    const serverTrigger = serverTriggers[node.data.id];
    if (!serverTrigger) throw new Error(`server trigger ${node.data.id} not found`);

    let first = true;
    const data: ExecuteData = {};
    const config = resolve(node.data.data.config.value, node.data.data.config.schema, {env, node: data});
    const generator = serverTrigger.exec({config, request});

    while (true) {
        const {done, value} = await generator.next();
        yield {
            node: {
                id: node.id,
                config,
                pluginId: node.data.id,
                pluginType: node.type,
            },
            first,
            ...value,
        };
        first = false;
        data[node.id] = value.results;
        if (value.out) {
            const next = context.findNextActionNode(node.id, value.out);
            if (next) {
                yield* executeAction({node: next, context, serverActions}, data);
            }
        }
        if (done) break;
    }
};
