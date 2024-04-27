import type {Node} from '@xyflow/svelte';
import type {ActionId} from '$lib/plugins/@action';
import type {TriggerId} from '$lib/plugins/@trigger';
import type {JSONSchema} from '$lib/schema/schema';

export type PluginNode = ActionNode | TriggerNode;
export type ActionNode = Node<ActionNodeData>;
export type TriggerNode = Node<TriggerNodeData>;
export type PluginNodeData = ActionNodeData | TriggerNodeData;

export interface ActionNodeData {
    id: ActionId;
    type: 'action';
    //
    name: string;
    icon: string;
    //
    inputs: string[];
    outputs: string[];
    params: {order: string[]; values: Record<string, JSONSchema>};
    returns: {order: string[]; values: Record<string, JSONSchema>};
    //
    [x: string]: unknown;
}

export interface TriggerNodeData {
    id: TriggerId;
    type: 'trigger';
    //
    name: string;
    icon: string;
    //
    outputs: string[];
    returns: {order: string[]; values: Record<string, JSONSchema>};
    //
    [x: string]: unknown;
}
