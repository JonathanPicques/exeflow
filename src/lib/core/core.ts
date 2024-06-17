import {get} from 'svelte/store';
import {init} from '@paralleldrive/cuid2';
import {getContext, setContext} from 'svelte';
import type {Writable} from 'svelte/store';

import {zero} from '$lib/schema/validate';
import {nodeSchema} from '$lib/core/graph/nodes';
import {edgeSchema} from '$lib/core/graph/edges';
import {isConstant} from '$lib/helper/parse';

import type {PluginEdge} from '$lib/core/graph/edges';
import type {JsonSchema} from '$lib/schema/schema';
import type {Action, ActionId} from '$lib/core/plugins/action';
import type {Trigger, TriggerId} from '$lib/core/plugins/trigger';
import type {PluginNode, ActionNode} from '$lib/core/graph/nodes';

export type Graph = {nodes: PluginNode[]; edges: PluginEdge[]};
export type Plugin = Action<JsonSchema> | Trigger<JsonSchema>;
export type PluginId = ActionId | TriggerId;

interface Options {
    nodes: Writable<PluginNode[]>;
    edges: Writable<PluginEdge[]>;
    actions: Record<ActionId, Action<JsonSchema>>;
    triggers: Record<TriggerId, Trigger<JsonSchema>>;
}

export class GraphContext {
    public readonly nodes: Writable<PluginNode[]>;
    public readonly edges: Writable<PluginEdge[]>;
    public readonly actions: Record<ActionId, Action<JsonSchema>>;
    public readonly triggers: Record<TriggerId, Trigger<JsonSchema>>;
    private readonly createId = init({length: 5});

    public constructor({nodes, edges, actions, triggers}: Options) {
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

    public findPlugin = (node: PluginNode) => {
        switch (node.type) {
            case 'action':
                return this.findAction(node.data.id);
            case 'trigger':
                return this.findTrigger(node.data.id);
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
        const {data} = type === 'action' ? this.findAction(id) : this.findTrigger(id);
        const newNode = {
            id: this.createId(),
            type,
            data: {id, data: await data({isConstant})},
            position,
        } as PluginNode;
        this.nodes.update(nodes => [...nodes, newNode]);
        return newNode;
    };
    public getNodeForm = async (id: PluginNode['id']) => {
        const node = this.findNode(id);
        const plugin = this.findPlugin(node);
        const schema = await plugin.form({
            config: node.data.data.config.value,
            //
            isConstant,
        });
        return {value: zero(schema), schema};
    };
    public updateNodeData = async (id: PluginNode['id'], form: unknown) => {
        const node = this.findNode(id);
        const plugin = this.findPlugin(node);
        const newData = await plugin.data({
            form: form as Partial<any>,
            config: node.data.data.config.value,
            //
            isConstant,
        });

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

const key = Symbol('graph');
export const getGraphContext = () => getContext<GraphContext>(key);
export const setGraphContext = (options: Options) => setContext(key, new GraphContext(options));

export const graphSchema = {
    type: 'object',
    required: ['nodes', 'edges'] as const,
    properties: {
        nodes: {type: 'array', items: nodeSchema},
        edges: {type: 'array', items: edgeSchema},
    },
} satisfies JsonSchema;
