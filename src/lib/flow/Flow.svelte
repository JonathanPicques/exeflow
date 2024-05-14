<script lang="ts">
    import {Panel, Background, SvelteFlow, useSvelteFlow} from '@xyflow/svelte';
    import type {Edge, Connection} from '@xyflow/svelte';

    import {valid} from '$lib/schema/validate';
    import CutEdge from '$lib/flow/edges/CutEdge.svelte';
    import Toolbar from '$lib/flow/toolbar/Toolbar.svelte';
    import ActionNode from '$lib/flow/nodes/Action.svelte';
    import TriggerNode from '$lib/flow/nodes/Trigger.svelte';
    import {layoutGraph} from '$lib/flow/dagre/dagre';
    import {getGraphContext} from '$lib/graph/data';

    import '@xyflow/svelte/dist/style.css';

    let {initialFitView = true} = $props();

    const {nodes, edges, createNode, positionNode} = getGraphContext();

    const edgeTypes = {edge: CutEdge};
    const nodeTypes = {action: ActionNode, trigger: TriggerNode};
    const defaultEdgeOptions = {type: 'edge'};

    const {fitView, screenToFlowPosition} = useSvelteFlow();

    const layout = () => {
        const layout = layoutGraph({nodes: $nodes, edges: $edges});

        $nodes = layout.nodes;
        $edges = layout.edges;
        fitView();
    };

    const ondrop = async (e: DragEvent) => {
        e.preventDefault();

        if (!e.dataTransfer) {
            return null;
        }

        const id = e.dataTransfer.getData('application/exeflow+plugin:id');
        const type = e.dataTransfer.getData('application/exeflow+plugin:type');
        const position = screenToFlowPosition({x: e.clientX, y: e.clientY});

        if (valid(id, {type: 'string'}) && valid(type, {type: 'string', enum: ['action', 'trigger'] as const})) {
            $nodes = [...$nodes, positionNode(await createNode(id, type), position)];
        }
    };
    const ondragover = (e: DragEvent) => {
        e.preventDefault();

        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
    };

    const onconnect = (connection: Connection) => {
        if (
            !connection.sourceHandle ||
            !connection.targetHandle ||
            $nodes.find(n => n.id === connection.target) === undefined ||
            $nodes.find(n => n.id === connection.source) === undefined
        ) {
            throw new Error(`onconnect invalid args`);
        }

        // FIXME: Make sure only one edge can exit from the source (right)
        // edges.update(edges => edges.filter(e => e.sourceHandle !== connection.sourceHandle || e.targetHandle === connection.targetHandle));
    };
    const isValidConnection = (connection: Edge | Connection) => {
        if (
            !connection.sourceHandle ||
            !connection.targetHandle ||
            $nodes.find(n => n.id === connection.target) === undefined ||
            $nodes.find(n => n.id === connection.source) === undefined
        ) {
            return false;
        }
        return true;
    };
</script>

<SvelteFlow fitView={initialFitView} {nodes} {nodeTypes} {edges} {edgeTypes} {defaultEdgeOptions} {onconnect} {isValidConnection} on:drop={ondrop} on:dragover={ondragover}>
    <Panel position="top-right">
        <button onclick={() => layout()}>Layout</button>
        <button onclick={() => fitView()}>Fit view</button>
    </Panel>
    <Panel position="top-center">
        <Toolbar />
    </Panel>
    <Background />
</SvelteFlow>

<style>
    :global(.svelte-flow) {
        background-color: var(--color-bg) !important;
        --xy-background-pattern-dots-color-default: var(--flow-color-grid-dots);
    }

    :global(.svelte-flow__edge) :global(path) {
        stroke: var(--flow-color-edge);
        stroke-width: 0.1rem;
    }

    :global(.svelte-flow__handle) {
        width: 0.4rem;
        height: 0.4rem;
        position: static;
        transform: none;
        border-color: var(--flow-color-point);
        background-color: var(--color-fill);
    }

    :global(.svelte-flow__handle.connectingto),
    :global(.svelte-flow__handle.connectingfrom) {
        --color-fill: var(--flow-color-point);
    }

    :global(.svelte-flow__attribution) {
        visibility: hidden;
    }
</style>
