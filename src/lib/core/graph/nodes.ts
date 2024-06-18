import type {Node} from '@xyflow/svelte';

import type {JsonSchema} from '$lib/schema/schema';
import type {ActionId, ActionData} from '$lib/core/plugins/action';
import type {TriggerId, TriggerData} from '$lib/core/plugins/trigger';

export type PluginNode = ActionNode | TriggerNode;
export type PluginNodeData = ActionNodeData | TriggerNodeData;

export interface ActionNode extends Node<ActionNodeData> {
    type: 'action';
}
export interface TriggerNode extends Node<TriggerNodeData> {
    type: 'trigger';
}

export interface ActionNodeData {
    id: ActionId;
    data: ActionData<JsonSchema>;
    //
    [x: string]: unknown;
}
export interface TriggerNodeData {
    id: TriggerId;
    data: TriggerData<JsonSchema>;
    //
    [x: string]: unknown;
}

export const isActionNode = (node: PluginNode): node is ActionNode => node.type === 'action';
export const isTriggerNode = (node: PluginNode): node is TriggerNode => node.type === 'trigger';

export const nodeSchema = {
    type: 'object',
    required: ['id', 'type', 'data', 'position', 'selected'] as const,
    properties: {
        id: {
            type: 'string',
        },
        type: {
            type: 'string',
            enum: ['action', 'trigger'] as const,
        },
        data: {
            type: 'object',
            required: ['id', 'data'] as const,
            properties: {
                id: {type: 'string'},
                data: {},
            },
        },
        position: {
            type: 'object',
            required: ['x', 'y'] as const,
            properties: {
                x: {type: 'number'},
                y: {type: 'number'},
            },
        },
        selected: {
            type: 'boolean',
        },
    },
} satisfies JsonSchema;
