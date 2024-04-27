<script lang="ts">
    import {writable} from 'svelte/store';
    import {Panel, Controls, Background, SvelteFlow, useSvelteFlow} from '@xyflow/svelte';
    import type {Edge, Connection} from '@xyflow/svelte';

    import CutEdge from '$lib/flow/edges/CutEdge.svelte';
    import Toolbar from '$lib/flow/toolbar/Toolbar.svelte';
    import ActionNode from '$lib/flow/nodes/Action.svelte';
    import TriggerNode from '$lib/flow/nodes/Trigger.svelte';
    import {compatible} from '$lib/schema/validate';
    import {layoutGraph} from '$lib/flow/dagre/dagre';
    import {splitHandleId} from '$lib/graph/points';
    import type {PluginEdge} from '$lib/graph/edges';
    import type {PluginNode} from '$lib/graph/nodes';
    import type {Action, ActionId} from '$lib/plugins/@action';
    import type {Trigger, TriggerId} from '$lib/plugins/@trigger';

    import '@xyflow/svelte/dist/style.css';
    import '$lib/flow/flow.css';

    export let actions: Record<ActionId, Action<unknown>>;
    export let triggers: Record<TriggerId, Trigger<unknown>>;
    export let initialNodes: PluginNode[];
    export let initialEdges: PluginEdge[];

    export let save: ((nodes: PluginNode[], edges: PluginEdge[]) => void) | undefined;

    const nodes = writable(initialNodes);
    const nodeTypes = {action: ActionNode, trigger: TriggerNode};

    const edges = writable(initialEdges);
    const edgeTypes = {edge: CutEdge};
    const defaultEdgeOptions = {type: 'edge'};

    const {fitView, screenToFlowPosition} = useSvelteFlow();

    const layout = () => {
        const graph = layoutGraph({nodes: $nodes, edges: $edges});

        $nodes = graph.nodes;
        $edges = graph.edges;
        fitView();
    };

    const ondrop = (e: DragEvent) => {
        e.preventDefault();

        if (!e.dataTransfer) {
            return null;
        }

        const id = e.dataTransfer.getData('application/exeflow+plugin:id');
        const type = e.dataTransfer.getData('application/exeflow+plugin:type');
        const plugin = ((id: string, type: 'action' | 'trigger') => {
            switch (type) {
                case 'action':
                    return actions[id]!;
                case 'trigger':
                    return triggers[id]!;
                default:
                    throw new Error('unreachable');
            }
        })(id, type as 'action' | 'trigger');
        const position = screenToFlowPosition({x: e.clientX, y: e.clientY});

        $nodes = [
            ...$nodes,
            {
                id: `${Math.random()}`,
                type: plugin.type,
                data: {
                    id,
                    icon: plugin.icon,
                    type: plugin.type,
                    name: plugin.title,
                    ...plugin.renderNode({config: {}}),
                },
                position,
            } as PluginNode,
        ];
    };
    const ondragover = (e: DragEvent) => {
        e.preventDefault();

        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
    };

    const onconnect = (connection: Connection) => {
        const leftNode = $nodes.find(n => n.id === connection.target);
        const rightNode = $nodes.find(n => n.id === connection.source);

        if (!leftNode || !rightNode || !connection.sourceHandle || !connection.targetHandle) {
            throw new Error(`onconnect invalid args`);
        }

        const {type: leftPointType} = splitHandleId(connection.targetHandle);
        const {type: rightPointType} = splitHandleId(connection.sourceHandle);

        if (leftPointType === 'input' && rightPointType === 'output') {
            // FIXME: Make sure only one edge can exit from the source (right)
            // edges.update(edges => edges.filter(e => e.sourceHandle !== connection.sourceHandle || e.targetHandle === connection.targetHandle));
        } else if (leftPointType === 'param' && rightPointType === 'return' && leftNode.data.type === 'action') {
            // FIXME: Make sure only one edge can enter into the target (left)
            // edges.update(edges => edges.filter(e => e.sourceHandle === connection.sourceHandle || e.targetHandle !== connection.targetHandle));
        } else {
            throw new Error(`onconnect: ${leftPointType} and ${rightPointType} cannot be connected`);
        }
    };
    const isValidConnection = (connection: Edge | Connection) => {
        const leftNode = $nodes.find(n => n.id === connection.target);
        const rightNode = $nodes.find(n => n.id === connection.source);

        if (!leftNode || !rightNode || !connection.sourceHandle || !connection.targetHandle) {
            return false;
        }

        const {id: leftPointId, type: leftPointType} = splitHandleId(connection.targetHandle);
        const {id: rightPointId, type: rightPointType} = splitHandleId(connection.sourceHandle);

        if (leftPointType === 'input' && rightPointType === 'output') {
            return true;
        } else if (leftPointType === 'param' && rightPointType === 'return' && leftNode.data.type === 'action') {
            const paramSchema = leftNode.data.params.values[leftPointId];
            const returnSchema = rightNode.data.returns.values[rightPointId];

            return compatible(paramSchema, returnSchema);
        }
        return false;
    };
</script>

<SvelteFlow
    {nodes}
    {nodeTypes}
    {edges}
    {edgeTypes}
    {defaultEdgeOptions}
    {onconnect}
    {isValidConnection}
    on:drop={ondrop}
    on:dragover={ondragover}
    fitView={initialNodes.length > 0}
>
    <Panel position="top-right">
        <button on:click={() => save?.($nodes, $edges)}>Save</button>
        <button on:click={() => layout()}>Layout</button>
        <button on:click={() => fitView()}>Fit view</button>
    </Panel>
    <Panel position="top-center">
        <Toolbar {actions} {triggers} />
    </Panel>
    <Controls />
    <Background />
</SvelteFlow>

<style>
    :global(.svelte-flow .svelte-flow__handle.connectingto) {
        background-color: #ff6060 !important;
    }

    :global(.svelte-flow .svelte-flow__handle.valid) {
        background-color: #55dd99 !important;
    }

    :global(.svelte-flow .svelte-flow__node .svelte-flow__handle) {
        width: 8px;
        height: 8px;
    }
</style>
