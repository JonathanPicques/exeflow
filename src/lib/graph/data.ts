import {get} from 'svelte/store';
import {init} from '@paralleldrive/cuid2';
import {getContext, setContext} from 'svelte';
import type {Writable} from 'svelte/store';

import {zero} from '$lib/schema/validate';
import type {PluginNode} from '$lib/graph/nodes';
import type {PluginEdge} from '$lib/graph/edges';
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

    public node = (id: PluginNode['id']) => {
        const node = get(this.nodes).find(n => n.id === id);
        if (!node) {
            throw new Error(`node ${id} not found`);
        }
        return node;
    };
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

    public createNode = async (id: PluginId, type: Plugin['type'], position: {x: number; y: number}) => {
        const plugin = this.plugin(id, type);
        const node = {
            id: this.createId(),
            type: plugin.type,
            data: {
                id,
                type: plugin.type,
                data: await plugin.data({}),
            },
            position,
        } as PluginNode;
        this.nodes.update(nodes => [...nodes, node]);
        return node;
    };
    public getNodeForm = async (id: PluginNode['id']) => {
        const node = this.node(id);
        const plugin = this.plugin(node.data.id, node.data.type);
        const schema = await plugin.form({config: node.data.data.config});
        return {value: zero(schema), schema};
    };
    public updateNodeData = async (id: PluginNode['id'], form: unknown) => {
        const node = this.node(id);
        const plugin = this.plugin(node.data.id, node.data.type);
        const newData = await plugin.data({form, config: node.data.data.config});

        this.nodes.update(nodes =>
            nodes.map(n => {
                if (n.id === id) {
                    return {...n, data: {...n.data, data: newData} as any};
                }
                return n;
            }),
        );
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
