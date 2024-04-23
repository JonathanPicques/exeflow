<script lang="ts">
    import {writable} from 'svelte/store';
    import {Panel, Controls, Background, SvelteFlow, useSvelteFlow, type Edge, type Connection} from '@xyflow/svelte';

    import CutEdge from '$lib/flow/edges/CutEdge.svelte';
    import ActionNode from '$lib/flow/nodes/Action.svelte';
    import TriggerNode from '$lib/flow/nodes/Trigger.svelte';
    import {layoutGraph} from '$lib/flow/dagre/dagre';

    import {compatible} from '$lib/schema/validate';
    import {initialEdges} from '$lib/graph/edges';
    import {initialNodes} from '$lib/graph/nodes';
    import {splitHandleId} from '$lib/graph/points';

    import '@xyflow/svelte/dist/style.css';
    import '$lib/flow/style.css';

    const edges = writable(initialEdges);
    const edgeTypes = {
        edge: CutEdge,
    };
    const defaultEdgeOptions = {type: 'edge'};

    const nodes = writable(initialNodes);
    const nodeTypes = {action: ActionNode, trigger: TriggerNode};

    const layout = () => {
        const graph = layoutGraph($nodes, $edges);

        $nodes = graph.nodes;
        $edges = graph.edges;

        fitView();
    };
    const {fitView} = useSvelteFlow();

    const onconnect = (connection: Connection) => {
        const leftNode = $nodes.find(n => n.id === connection.target);
        const rightNode = $nodes.find(n => n.id === connection.source);

        if (!leftNode || !rightNode || !connection.sourceHandle || !connection.targetHandle) {
            throw new Error(`onconnect invalid args`);
        }

        const {type: leftPointType} = splitHandleId(connection.targetHandle);
        const {type: rightPointType} = splitHandleId(connection.sourceHandle);

        if (leftPointType === 'input' && rightPointType === 'output') {
            // Make sure only one edge can exit from the source (right)
            edges.update(edges => edges.filter(e => e.sourceHandle !== connection.sourceHandle || e.targetHandle === connection.targetHandle));
        } else if (leftPointType === 'param' && rightPointType === 'return' && leftNode.data.type === 'action') {
            // Make sure only one edge can enter into the target (left)
            edges.update(edges => edges.filter(e => e.sourceHandle === connection.sourceHandle || e.targetHandle !== connection.targetHandle));
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

<main>
    <SvelteFlow fitView {edges} {edgeTypes} {nodes} {nodeTypes} {defaultEdgeOptions} {onconnect} {isValidConnection}>
        <Panel position="top-right">
            <button on:click={() => layout()}>Layout</button>
            <button on:click={() => fitView()}>Fit view</button>
        </Panel>
        <Controls />
        <Background />
    </SvelteFlow>
</main>

<style>
    main {
        flex-grow: 1;
    }

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
