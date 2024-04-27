<script lang="ts">
    import {_PATCH} from '../../api/project/[id]/fetch.client.js';

    import {writable} from 'svelte/store';
    import {Panel, Controls, Background, SvelteFlow, useSvelteFlow, type Edge, type Connection} from '@xyflow/svelte';

    import Toolbar from '$lib/flow/Toolbar.svelte';
    import CutEdge from '$lib/flow/edges/CutEdge.svelte';
    import ActionNode from '$lib/flow/nodes/Action.svelte';
    import TriggerNode from '$lib/flow/nodes/Trigger.svelte';
    import {layoutGraph} from '$lib/flow/dagre/dagre';

    import {compatible} from '$lib/schema/validate';
    import {splitHandleId} from '$lib/graph/points';

    import '@xyflow/svelte/dist/style.css';
    import '$lib/flow/style.css';

    export let data;

    const project = data.project;

    const edges = writable(project.content.edges);
    const edgeTypes = {edge: CutEdge};
    const defaultEdgeOptions = {type: 'edge'};

    const nodes = writable(project.content.nodes);
    const nodeTypes = {action: ActionNode, trigger: TriggerNode};

    const {fitView, screenToFlowPosition} = useSvelteFlow();

    const save = () => {
        _PATCH({
            id: project.id,
            content: {nodes: $nodes, edges: $edges},
        });
    };
    const layout = () => {
        const graph = layoutGraph($nodes, $edges);

        $nodes = graph.nodes;
        $edges = graph.edges;

        fitView();
    };

    const ondrop = (e: DragEvent) => {
        e.preventDefault();

        if (!e.dataTransfer) {
            return null;
        }

        const name = e.dataTransfer.getData('application/svelteflow:name');
        const position = screenToFlowPosition({x: e.clientX, y: e.clientY});

        $nodes = [
            ...$nodes,
            {
                ...$nodes[0]!,
                id: `${Math.random()}`,
                data: {
                    ...($nodes[0]!.data as any),
                    name,
                },
                position,
            },
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
            // FIXME
            // Make sure only one edge can exit from the source (right)
            edges.update(edges => edges.filter(e => e.sourceHandle !== connection.sourceHandle || e.targetHandle === connection.targetHandle));
        } else if (leftPointType === 'param' && rightPointType === 'return' && leftNode.data.type === 'action') {
            // FIXME
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
    <SvelteFlow fitView {edges} {edgeTypes} {nodes} {nodeTypes} {defaultEdgeOptions} {onconnect} {isValidConnection} on:drop={ondrop} on:dragover={ondragover}>
        <Panel position="top-right">
            <button on:click={() => save()}>Save</button>
            <button on:click={() => layout()}>Layout</button>
            <button on:click={() => fitView()}>Fit view</button>
        </Panel>
        <Panel position="top-center">
            <Toolbar actions={data.actions} triggers={data.triggers} />
        </Panel>
        <Controls />
        <Background />
    </SvelteFlow>
</main>

<style>
    main {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
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
