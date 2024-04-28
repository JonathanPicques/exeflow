<script lang="ts">
    import {Panel, Controls, Background, SvelteFlow, useSvelteFlow} from '@xyflow/svelte';
    import type {Edge, Connection} from '@xyflow/svelte';

    import CutEdge from '$lib/flow/edges/CutEdge.svelte';
    import Toolbar from '$lib/flow/toolbar/Toolbar.svelte';
    import ActionNode from '$lib/flow/nodes/Action.svelte';
    import TriggerNode from '$lib/flow/nodes/Trigger.svelte';
    import {layoutGraph} from '$lib/flow/dagre/dagre';
    import {splitHandleId} from '$lib/graph/points';
    import {getGraphContext} from '$lib/graph/data';
    import {valid, compatible} from '$lib/schema/validate';

    import '@xyflow/svelte/dist/style.css';
    import '$lib/flow/flow.css';

    export let initialFitView: boolean;

    const {nodes, edges, createNode, positionNode} = getGraphContext();

    const edgeTypes = {edge: CutEdge};
    const nodeTypes = {action: ActionNode, trigger: TriggerNode};
    const defaultEdgeOptions = {type: 'edge'};

    const {fitView, screenToFlowPosition} = useSvelteFlow();

    const layout = () => {
        const graph = layoutGraph({nodes: $nodes, edges: $edges});

        $nodes = graph.nodes;
        $edges = graph.edges;
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

<SvelteFlow fitView={initialFitView} {nodes} {nodeTypes} {edges} {edgeTypes} {defaultEdgeOptions} {onconnect} {isValidConnection} on:drop={ondrop} on:dragover={ondragover}>
    <Panel position="top-right">
        <button on:click={() => layout()}>Layout</button>
        <button on:click={() => fitView()}>Fit view</button>
    </Panel>
    <Panel position="top-center">
        <Toolbar />
    </Panel>
    <Controls />
    <Background />
</SvelteFlow>
