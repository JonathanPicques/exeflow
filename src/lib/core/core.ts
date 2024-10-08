import {get} from 'svelte/store';
import {init} from '@paralleldrive/cuid2';
import {getContext, setContext} from 'svelte';
import type {Writable} from 'svelte/store';

import {zero} from '$lib/schema/data';
import {constant} from '$lib/core/parse';
import {nodeSchema} from '$lib/core/graph/nodes';
import {edgeSchema} from '$lib/core/graph/edges';
import {stableChecksum} from '$lib/helper/check';

import type {PluginEdge} from '$lib/core/graph/edges';
import type {JsonSchema} from '$lib/schema/schema';
import type {Action, ActionId} from '$lib/core/plugins/action';
import type {Trigger, TriggerId} from '$lib/core/plugins/trigger';
import type {PluginNode, ActionNode} from '$lib/core/graph/nodes';

export type Graph = {nodes: PluginNode[]; edges: PluginEdge[]};
export type Plugin = Action<JsonSchema> | Trigger<JsonSchema>;
export type PluginId = ActionId | TriggerId;

interface Params {
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

    public constructor({nodes, edges, actions, triggers}: Params) {
        this.nodes = nodes;
        this.edges = edges;
        this.actions = actions;
        this.triggers = triggers;
    }

    public getPlugin = (node: PluginNode) => {
        switch (node.type) {
            case 'action':
                return this.getAction(node.data.id);
            case 'trigger':
                return this.getTrigger(node.data.id);
            default:
                throw new Error('unreachable');
        }
    };
    public getAction = (id: ActionId) => {
        if (!this.actions[id]) {
            throw new Error(`action ${id} not found`);
        }
        return this.actions[id];
    };
    public getTrigger = (id: TriggerId) => {
        if (!this.triggers[id]) {
            throw new Error(`trigger ${id} not found`);
        }
        return this.triggers[id];
    };

    public getNode = (id: PluginNode['id']) => {
        const node = get(this.nodes).find(n => n.id === id);
        if (!node) throw new Error(`node ${id} not found`);

        return node;
    };
    public findNode = (id: PluginNode['id']) => {
        return get(this.nodes).find(n => n.id === id);
    };
    public getNextNode = (id: PluginNode['id'], sourceHandle: string) => {
        const edge = get(this.edges).find(e => e.source === id && e.sourceHandle === sourceHandle);
        if (!edge || !edge.sourceHandle || !edge.targetHandle) return undefined;

        return {
            node: this.getNode(edge.target) as ActionNode,
            input: edge.targetHandle!,
            output: edge.sourceHandle!,
        };
    };
    public getNodesAfter = (id: PluginNode['id']) => {
        const edges = get(this.edges);
        const after: PluginNode['id'][] = [];
        const visit: PluginNode['id'][] = [id];
        const visited: PluginNode['id'][] = [];

        while (visit.length > 0) {
            const nodeId = visit.pop()!;
            visited.push(nodeId);

            for (const {target} of edges.filter(e => e.source === nodeId)) {
                if (!visited.includes(target)) {
                    visit.push(target);
                    after.push(target);
                }
            }
        }
        return after.map(id => this.getNode(id));
    };
    public getNodesBefore = (id: PluginNode['id']) => {
        const edges = get(this.edges);
        const visit: PluginNode['id'][] = [id];
        const before: PluginNode['id'][] = [];
        const visited: PluginNode['id'][] = [];

        while (visit.length > 0) {
            const node = visit.pop()!;
            visited.push(node);

            for (const {source} of edges.filter(e => e.target === node)) {
                if (!visited.includes(source)) {
                    visit.push(source);
                    before.push(source);
                }
            }
        }
        return before.map(id => this.getNode(id));
    };

    public createNode = async (id: PluginId, type: Plugin['type'], position: {x: number; y: number}) => {
        const {data} = type === 'action' ? this.getAction(id) : this.getTrigger(id);
        const newNode = {
            id: this.createId(),
            type,
            data: {id, data: await data({constant})},
            position,
        } as PluginNode;
        this.nodes.update(nodes => [...nodes, newNode]);
        return newNode;
    };
    public renderNodeForm = async (id: PluginNode['id']) => {
        const node = this.getNode(id);
        const plugin = this.getPlugin(node);
        const schema = await plugin.form({
            config: node.data.data.config.value,
            //
            constant,
        });
        return {value: zero(schema), schema};
    };
    public updateNodeData = async (id: PluginNode['id'], form: unknown) => {
        const node = this.getNode(id);
        const plugin = this.getPlugin(node);
        const newData = await plugin.data({
            form: form as Partial<any>,
            config: node.data.data.config.value,
            //
            constant,
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

    public checksum = (nodes = get(this.nodes), edges = get(this.edges)) => {
        return stableChecksum({
            nodes: nodes
                .map(n => ({
                    id: n.id,
                    data: n.data,
                }))
                .toSorted((a, b) => a.id.localeCompare(b.id)),
            edges: edges
                .map(e => ({
                    source: e.source,
                    sourceHandle: e.sourceHandle,
                    target: e.target,
                    targetHandle: e.targetHandle,
                }))
                .toSorted((a, b) => `${a.source}${a.sourceHandle}${a.target}${a.targetHandle}`.localeCompare(`${b.source}${b.sourceHandle}${b.target}${b.targetHandle}`)),
        });
    };
    public exportGraph = () => {
        return this.exportSelection(get(this.nodes).map(n => n.id));
    };
    public exportSelection = (ids: PluginNode['id'][]): Graph => {
        return {
            nodes: get(this.nodes)
                .filter(n => ids.includes(n.id))
                .map(this.serializeNode),
            edges: get(this.edges)
                .filter(e => ids.includes(e.source) && ids.includes(e.target))
                .map(this.serializeEdge),
        };
    };
    public importSelection = ({nodes, edges}: Graph, offset = {x: 0, y: 0}) => {
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

    private serializeNode = ({id, type, data, position, selected}: PluginNode) => ({id, type, data, position, selected}) as PluginNode;
    private serializeEdge = ({id, source, target, sourceHandle, targetHandle, selected}: PluginEdge) => ({id, source, target, sourceHandle, targetHandle, selected}) as PluginEdge;
}

export const importPlugins = async () => {
    const actions: Record<ActionId, Action<JsonSchema>> = {};
    const triggers: Record<TriggerId, Trigger<JsonSchema>> = {};
    const pluginModules = import.meta.glob(['$lib/plugins/**/*.ts', '!$lib/plugins/**/*.server.ts'], {eager: true, import: 'default'});

    for (const [path, module] of Object.entries(pluginModules)) {
        const id = path.replace('/src/lib/plugins/', '').replace('/', ':').replace('.ts', ''); // transforms '/src/lib/plugins/discord/sendMessage.ts' to 'discord:sendMessage'
        const plugin = module as Action<JsonSchema> | Trigger<JsonSchema>;

        switch (plugin.type) {
            case 'action':
                actions[id] = plugin;
                break;
            case 'trigger':
                triggers[id] = plugin;
                break;
            default:
                throw new Error(`malformed plugin ${id}`);
        }
    }
    return {actions, triggers};
};

export const graphContextKey = Symbol('graph');
export const getGraphContext = () => getContext<GraphContext>(graphContextKey);
export const setGraphContext = (params: Params) => setContext(graphContextKey, new GraphContext(params));

export const graphSchema = {
    type: 'object',
    required: ['nodes', 'edges'] as const,
    properties: {
        nodes: {type: 'array', items: nodeSchema},
        edges: {type: 'array', items: edgeSchema},
    },
} satisfies JsonSchema;
