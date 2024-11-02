import {resolve, pluginId} from '$lib/core/parser/parser';
import type {ActionId} from '$lib/core/plugins/action';
import type {TriggerId} from '$lib/core/plugins/trigger';
import type {JsonSchema} from '$lib/core/schema/schema';
import type {ServerAction} from '$lib/core/plugins/action.server';
import type {ServerTrigger} from '$lib/core/plugins/trigger.server';
import type {PluginId, PluginEdge, PluginNode} from '$lib/core/core';

type ExecuteData = {
    [k: ServerPluginNode['id']]: Record<string, unknown>;
};

type ExecuteStep = {
    nodeId: ServerPluginNode['id'];
    pluginId: PluginId;
    config: unknown;
    results: Record<string, unknown>;
};

export interface ServerActionNode {
    id: PluginNode['id'];
    type: 'action';
    config: {value: unknown; schema: JsonSchema};
    pluginId: PluginId;
}

export interface ServerTriggerNode {
    id: PluginNode['id'];
    type: 'trigger';
    config: {value: unknown; schema: JsonSchema};
    pluginId: PluginId;
}

export type ServerGraph = {serverNodes: ServerActionNode[]; serverEdges: ServerPluginEdge[]};
export type ServerPluginNode = ServerActionNode | ServerTriggerNode;
export type ServerPluginEdge = {
    id: string;
    source: string;
    target: string;
    sourceHandle: string;
    targetHandle: string;
};

export class ServerGraphContext {
    private readonly secrets: Record<string, string>;
    private readonly serverNodes: Record<ServerPluginNode['id'], ServerPluginNode>;
    private readonly serverEdges: ServerPluginEdge[];
    private readonly serverActions: Record<ActionId, ServerAction<JsonSchema>>;
    private readonly serverTriggers: Record<ActionId, ServerTrigger<JsonSchema>>;

    public constructor({
        secrets,
        serverNodes,
        serverEdges,
        serverActions,
        serverTriggers,
    }: {
        secrets: ServerGraphContext['secrets'];
        serverNodes: ServerGraphContext['serverNodes'];
        serverEdges: ServerGraphContext['serverEdges'];
        serverActions: ServerGraphContext['serverActions'];
        serverTriggers: ServerGraphContext['serverTriggers'];
    }) {
        this.secrets = secrets;
        this.serverNodes = serverNodes;
        this.serverEdges = serverEdges;
        this.serverActions = serverActions;
        this.serverTriggers = serverTriggers;
    }

    public getServerNode = (id: ServerPluginNode['id']) => {
        const node = this.serverNodes[id];
        if (!node) throw new Error(`server node ${id} not found`);

        return node;
    };
    public getNextServerNode = (id: ServerPluginNode['id'], sourceHandle: string) => {
        const edge = this.serverEdges.find(e => e.source === id && e.sourceHandle === sourceHandle);
        if (!edge || !edge.sourceHandle || !edge.targetHandle) return undefined;

        return {
            node: this.serverNodes[edge.target],
            input: edge.targetHandle!,
            output: edge.sourceHandle!,
        };
    };

    public async *executeAction({node, data, input, signal}: {node: ServerPluginNode; data: ExecuteData; input: string; signal: AbortSignal}): AsyncGenerator<ExecuteStep> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const ctx = this;
        const serverAction = this.serverActions[node.pluginId];
        if (!serverAction) throw new Error(`server action ${node.pluginId} not found`);

        const config = resolve(node.config.value, node.config.schema, {nodes: data, secrets: this.secrets});

        yield {nodeId: node.id, pluginId: node.pluginId, config, results: data};

        yield* serverAction.exec({
            next: async function* ({output, results}) {
                const nextNode = ctx.getNextServerNode(node.id, output);

                if (nextNode && !signal.aborted) {
                    data[node.id] = results;
                    yield* ctx.executeAction({data, node: nextNode.node, input: nextNode.input, signal});
                }
            },
            input,
            //
            config,
            signal,
        });
    }
    public async *executeTrigger({node, signal, request}: {node: ServerPluginNode; signal: AbortSignal; request?: Request}): AsyncGenerator<ExecuteStep> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const ctx = this;
        const serverTrigger = this.serverTriggers[node.pluginId];
        if (!serverTrigger) throw new Error(`server trigger ${node.pluginId} not found`);

        const data: ExecuteData = {};
        const config = resolve(node.config.value, node.config.schema, {nodes: data, secrets: this.secrets});

        yield {nodeId: node.id, pluginId: node.pluginId, config, results: data};

        yield* serverTrigger.exec({
            next: async function* ({output, results}) {
                const nextNode = ctx.getNextServerNode(node.id, output);

                if (nextNode && !signal.aborted) {
                    data[node.id] = results;
                    yield* ctx.executeAction({data, node: nextNode.node, input: nextNode.input, signal});
                }
            },
            //
            config,
            signal,
            request,
        });
    }

    public static fromNodes = (nodes: PluginNode[]): ServerGraphContext['serverNodes'] => {
        return Object.fromEntries(
            nodes.map(node => {
                return [
                    node.id,
                    {
                        id: node.id,
                        type: node.type,
                        config: node.data.data.config,
                        pluginId: node.data.id,
                    } satisfies ServerPluginNode,
                ];
            }),
        );
    };
    public static fromEdges = (edges: PluginEdge[]): ServerGraphContext['serverEdges'] => {
        return edges.map(edge => {
            return {
                id: edge.id,
                source: edge.source,
                sourceHandle: edge.sourceHandle!,
                target: edge.target,
                targetHandle: edge.targetHandle!,
            } satisfies ServerPluginEdge;
        });
    };
    public static isServerActionNode = (node: ServerPluginNode): node is ServerActionNode => node.type === 'action';
    public static isServerTriggerNode = (node: ServerPluginNode): node is ServerTriggerNode => node.type === 'trigger';
}

export const importServerPlugins = async () => {
    const serverActions: Record<ActionId, ServerAction<JsonSchema>> = {};
    const serverTriggers: Record<TriggerId, ServerTrigger<JsonSchema>> = {};
    const serverPluginModules = import.meta.glob(['$lib/plugins/*/*.server.ts', '!$lib/plugins/*/+*.server.ts'], {eager: true, import: 'default'});

    for (const [path, module] of Object.entries(serverPluginModules)) {
        const id = pluginId(path);
        const plugin = module as ServerAction<JsonSchema> | ServerTrigger<JsonSchema>;

        switch (plugin.type) {
            case 'serverAction':
                serverActions[id] = plugin;
                break;
            case 'serverTrigger':
                serverTriggers[id] = plugin;
                break;
            default:
                throw new Error(`malformed server plugin ${id}`);
        }
    }
    return {serverActions, serverTriggers};
};

export const serverNodeSchema = {
    type: 'object',
    required: ['id', 'type', 'config', 'pluginId'] as const,
    properties: {
        id: {type: 'string'},
        type: {type: 'string', enum: ['action', 'trigger'] as const},
        config: {
            type: 'object',
            required: ['value', 'schema'] as const,
            properties: {
                value: {},
                schema: {},
            },
        },
        pluginId: {type: 'string'},
    },
} satisfies JsonSchema;
export const serverEdgeSchema = {
    type: 'object',
    required: ['id', 'source', 'target', 'sourceHandle', 'targetHandle'] as const,
    properties: {
        id: {type: 'string'},
        source: {type: 'string'},
        target: {type: 'string'},
        sourceHandle: {type: 'string'},
        targetHandle: {type: 'string'},
    },
} satisfies JsonSchema;
export const serverGraphSchema = {
    type: 'object',
    required: ['nodes', 'edges'] as const,
    properties: {
        nodes: {type: 'array', items: serverNodeSchema},
        edges: {type: 'array', items: serverEdgeSchema},
    },
} satisfies JsonSchema;
