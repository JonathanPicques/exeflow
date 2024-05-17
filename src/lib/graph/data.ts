import {init} from '@paralleldrive/cuid2';
import {getContext, setContext} from 'svelte';
import type {Writable} from 'svelte/store';

import type {PluginNode} from './nodes';
import type {PluginEdge} from './edges';
import type {Action, ActionId, ActionData} from '$lib/plugins/@action';
import type {Trigger, TriggerId, TriggerData} from '$lib/plugins/@trigger';

export type Plugin = Action<unknown> | Trigger<unknown>;
export type PluginId = ActionId | TriggerId;
export type PluginData = ActionData<unknown> | TriggerData<unknown>;

class GraphContext {
    public readonly nodes: Writable<PluginNode[]>;
    public readonly edges: Writable<PluginEdge[]>;
    public readonly values: Writable<Record<string, unknown>>;
    public readonly actions: Record<ActionId, Action<unknown>>;
    public readonly triggers: Record<TriggerId, Trigger<unknown>>;
    private readonly createId = init({length: 5});

    public constructor({nodes, edges, values, actions, triggers}: GraphContextOptions) {
        this.nodes = nodes;
        this.edges = edges;
        this.values = values;
        this.actions = actions;
        this.triggers = triggers;
    }

    public plugin = (id: PluginId, type: Plugin['type']) => {
        switch (type) {
            case 'action':
                return this.action(id);
            case 'trigger':
                return this.trigger(id);
            default:
                throw new Error('unreachable');
        }
    };
    public action = (id: ActionId) => {
        if (!this.actions[id]) {
            throw new Error(`action ${id} not found`);
        }
        return this.actions[id];
    };
    public trigger = (id: TriggerId) => {
        if (!this.triggers[id]) {
            throw new Error(`trigger ${id} not found`);
        }
        return this.triggers[id];
    };

    public createNode = async (id: PluginId, type: Plugin['type']) => {
        const plugin = this.plugin(id, type);

        return {
            id: this.createId(),
            type: plugin.type,
            data: {
                id,
                type: plugin.type,
                data: await plugin.data({}),
            },
            position: {x: 0, y: 0},
        } as PluginNode;
    };
    public positionNode = (node: PluginNode, position: {x: number; y: number}) => {
        return {...node, position};
    };
}

interface GraphContextOptions {
    nodes: Writable<PluginNode[]>;
    edges: Writable<PluginEdge[]>;
    values: Writable<Record<string, unknown>>;
    //
    actions: Record<ActionId, Action<unknown>>;
    triggers: Record<TriggerId, Trigger<unknown>>;
}

const key = Symbol('graph');
export const getGraphContext = () => getContext<GraphContext>(key);
export const setGraphContext = (options: GraphContextOptions) => setContext(key, new GraphContext(options));
