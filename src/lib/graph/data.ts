import {getContext, setContext} from 'svelte';
import type {Writable} from 'svelte/store';

import type {PluginNode} from './nodes';
import type {PluginEdge} from './edges';
import type {Action, ActionId} from '$lib/plugins/@action';
import type {Trigger, TriggerId} from '$lib/plugins/@trigger';

class GraphContext {
    public readonly nodes: Writable<PluginNode[]>;
    public readonly edges: Writable<PluginEdge[]>;
    public readonly values: Writable<Record<string, unknown>>;
    public readonly actions: Record<ActionId, Action<unknown>>;
    public readonly triggers: Record<TriggerId, Trigger<unknown>>;

    public constructor({nodes, edges, values, actions, triggers}: GraphContextOptions) {
        this.nodes = nodes;
        this.edges = edges;
        this.values = values;
        this.actions = actions;
        this.triggers = triggers;
    }

    public action = (actionId: ActionId) => {
        if (!this.actions[actionId]) {
            throw new Error(`action ${actionId} not found`);
        }
        return this.actions[actionId];
    };
    public trigger = (triggerId: TriggerId) => {
        if (!this.triggers[triggerId]) {
            throw new Error(`trigger ${triggerId} not found`);
        }
        return this.triggers[triggerId];
    };
    public plugin = (id: ActionId | TriggerId, type: Action<unknown>['type'] | Trigger<unknown>['type']) => {
        switch (type) {
            case 'action':
                return this.action(id);
            case 'trigger':
                return this.trigger(id);
            default:
                throw new Error('unreachable');
        }
    };

    public createNode = async (id: ActionId | TriggerId, type: Action<unknown>['type'] | Trigger<unknown>['type']) => {
        const plugin = this.plugin(id, type);

        return {
            id: `${Math.random()}`,
            type: plugin.type,
            data: {
                id,
                type: plugin.type,
                icon: plugin.icon,
                name: plugin.title,
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
