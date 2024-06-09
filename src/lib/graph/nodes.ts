import type {Node} from '@xyflow/svelte';
import type {ActionId, ActionData} from '$lib/plugins/@action';
import type {TriggerId, TriggerData} from '$lib/plugins/@trigger';

export type PluginNode = ActionNode | TriggerNode;
export type ActionNode = Node<ActionNodeData>;
export type TriggerNode = Node<TriggerNodeData>;
export type PluginNodeData = ActionNodeData | TriggerNodeData;

export interface ActionNodeData {
    id: ActionId;
    type: 'action';
    data: ActionData<unknown>;
    //
    [x: string]: unknown;
}

export interface TriggerNodeData {
    id: TriggerId;
    type: 'trigger';
    data: TriggerData<unknown>;
    //
    [x: string]: unknown;
}

export const isActionNode = (node: PluginNode): node is ActionNode => {
    return node.type === 'action';
};

export const isTriggerNode = (node: PluginNode): node is TriggerNode => {
    return node.type === 'trigger';
};
