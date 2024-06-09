import type {Node} from '@xyflow/svelte';
import type {ActionId, ActionData} from '$lib/plugins/@action';
import type {TriggerId, TriggerData} from '$lib/plugins/@trigger';

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
    data: ActionData<unknown>;
    //
    [x: string]: unknown;
}
export interface TriggerNodeData {
    id: TriggerId;
    data: TriggerData<unknown>;
    //
    [x: string]: unknown;
}

export const isActionNode = (node: PluginNode): node is ActionNode => node.type === 'action';
export const isTriggerNode = (node: PluginNode): node is TriggerNode => node.type === 'trigger';
