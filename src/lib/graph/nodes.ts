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
    //
    name: string;
    icon: string;
    data: ActionData<unknown>;
    //
    [x: string]: unknown;
}

export interface TriggerNodeData {
    id: TriggerId;
    type: 'trigger';
    //
    name: string;
    icon: string;
    data: TriggerData<unknown>;
    //
    [x: string]: unknown;
}
