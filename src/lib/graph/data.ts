import {get} from 'svelte/store';
import {init} from '@paralleldrive/cuid2';
import {getContext, setContext} from 'svelte';
import type {Writable} from 'svelte/store';

import {zero} from '$lib/schema/validate';
import type {PluginEdge} from '$lib/graph/edges';
import type {JsonSchema} from '$lib/schema/schema';
import type {PluginNode, ActionNode} from '$lib/graph/nodes';
import type {Action, ActionId, ActionData} from '$lib/plugins/@action';
import type {Trigger, TriggerId, TriggerData} from '$lib/plugins/@trigger';

export type Graph = {nodes: PluginNode[]; edges: PluginEdge[]};
export type Plugin = Action<unknown> | Trigger<unknown>;
export type PluginId = ActionId | TriggerId;
export type PluginData = ActionData<unknown> | TriggerData<unknown>;

class GraphContext {
    public readonly nodes: Writable<PluginNode[]>;
    public readonly edges: Writable<PluginEdge[]>;
    public readonly actions: Record<ActionId, Action<unknown>>;
    public readonly triggers: Record<TriggerId, Trigger<unknown>>;
    private readonly createId = init({length: 5});

    public constructor({nodes, edges, actions, triggers}: GraphContextOptions) {
        this.nodes = nodes;
        this.edges = edges;
        this.actions = actions;
        this.triggers = triggers;
    }

    public findNode = (id: PluginNode['id']) => {
        const node = get(this.nodes).find(n => n.id === id);
        if (!node) {
            throw new Error(`node ${id} not found`);
        }
        return node;
    };
    public findNextActionNode = (id: PluginNode['id'], out: string) => {
        const edge = get(this.edges).find(e => e.source === id && e.sourceHandle === out);
        if (!edge) {
            return undefined;
        }
        return this.findNode(edge.target) as ActionNode;
    };

    public findPlugin = (id: PluginId, type: Plugin['type']) => {
        switch (type) {
            case 'action':
                return this.findAction(id);
            case 'trigger':
                return this.findTrigger(id);
            default:
                throw new Error('unreachable');
        }
    };
    public findAction = (id: ActionId) => {
        if (!this.actions[id]) {
            throw new Error(`action ${id} not found`);
        }
        return this.actions[id];
    };
    public findTrigger = (id: TriggerId) => {
        if (!this.triggers[id]) {
            throw new Error(`trigger ${id} not found`);
        }
        return this.triggers[id];
    };

    public createNode = async (id: PluginId, type: Plugin['type'], position: {x: number; y: number}) => {
        const plugin = this.findPlugin(id, type);
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
        const node = this.findNode(id);
        const plugin = this.findPlugin(node.data.id, node.data.type);
        const schema = await plugin.form({config: node.data.data.config});
        return {value: zero(schema), schema};
    };
    public updateNodeData = async (id: PluginNode['id'], form: unknown) => {
        const node = this.findNode(id);
        const plugin = this.findPlugin(node.data.id, node.data.type);
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

    public exportGraph = (ids: PluginNode['id'][]): Graph => {
        return {
            nodes: get(this.nodes)
                .filter(n => ids.includes(n.id))
                .map(({id, type, data, position}) => ({id, type, data, position}) as PluginNode),
            edges: get(this.edges)
                .filter(e => ids.includes(e.source) && ids.includes(e.target))
                .map(({id, source, target, sourceHandle, targetHandle}) => ({id, source, target, sourceHandle, targetHandle}) as PluginEdge),
        };
    };
    public importGraph = ({nodes, edges}: Graph, offset = {x: 0, y: 0}) => {
        const mapping: Record<PluginNode['id'], PluginNode['id']> = {};

        for (const node of nodes) {
            mapping[node.id] = this.createId();
        }
        const importedNodes = structuredClone(nodes);
        const importedEdges = structuredClone(edges);
        for (const importedNode of importedNodes) {
            importedNode.id = mapping[importedNode.id];
            importedNode.position.x += offset.x;
            importedNode.position.y += offset.y;
        }
        for (const importedEdge of importedEdges) {
            importedEdge.id = importedEdge.id.replace(importedEdge.source, mapping[importedEdge.source]).replace(importedEdge.target, mapping[importedEdge.target]);
            importedEdge.source = mapping[importedEdge.source];
            importedEdge.target = mapping[importedEdge.target];
        }
        this.nodes.update(nodes => [...nodes.map(n => ({...n, selected: false})), ...importedNodes.map(n => ({...n, selected: true}))]);
        this.edges.update(edges => [...edges.map(e => ({...e, selected: false})), ...importedEdges.map(e => ({...e, selected: true}))]);
    };
}

interface GraphContextOptions {
    nodes: Writable<PluginNode[]>;
    edges: Writable<PluginEdge[]>;
    //
    actions: Record<ActionId, Action<unknown>>;
    triggers: Record<TriggerId, Trigger<unknown>>;
}

const key = Symbol('graph');

export const nodeSchema = {
    type: 'object',
    required: ['id', 'type', 'data', 'position'],
    properties: {
        id: {
            type: 'string',
        },
        type: {
            type: 'string',
            enum: ['action', 'trigger'],
        },
        data: {},
        position: {
            type: 'object',
            required: ['x', 'y'],
            properties: {
                x: {type: 'number'},
                y: {type: 'number'},
            },
        },
    },
} satisfies JsonSchema;
export const edgeSchema = {
    type: 'object',
    required: ['id', 'source', 'target', 'sourceHandle', 'targetHandle'],
    properties: {
        id: {type: 'string'},
        source: {type: 'string'},
        target: {type: 'string'},
        sourceHandle: {type: 'string'},
        targetHandle: {type: 'string'},
    },
} satisfies JsonSchema;
export const graphSchema = {
    type: 'object',
    required: ['nodes', 'edges'],
    properties: {
        nodes: {type: 'array', items: nodeSchema},
        edges: {type: 'array', items: edgeSchema},
    },
} satisfies JsonSchema;
export const getGraphContext = () => getContext<GraphContext>(key);
export const setGraphContext = (options: GraphContextOptions) => setContext(key, new GraphContext(options));
