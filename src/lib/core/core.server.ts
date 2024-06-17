import * as env from '$env/static/private';

import {resolve} from '$lib/helper/parse';
import type {ActionId} from '$lib/core/plugins/action';
import type {TriggerId} from '$lib/core/plugins/trigger';
import type {JsonSchema} from '$lib/schema/schema';
import type {GraphContext} from '$lib/core/core';
import type {ServerAction} from '$lib/core/plugins/action.server';
import type {ServerTrigger} from '$lib/core/plugins/trigger.server';
import type {PluginNode, ActionNode, TriggerNode} from '$lib/core/graph/nodes';

interface ExecuteData {
    [K: PluginNode['id']]: Record<string, unknown>;
}

interface ExecuteStep {
    out?: string;
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
        yield value;
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

export const executeTrigger = async function* ({node, context, serverActions}: TriggerExecuteArgs<TriggerNode>) {
    const next = context.findNextActionNode(node.id, 'out'); // TODO: determine out
    if (next) {
        yield* executeAction({node: next, context, serverActions});
    }
};
