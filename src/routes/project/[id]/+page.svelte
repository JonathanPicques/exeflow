<script lang="ts">
    import {SvelteFlowProvider} from '@xyflow/svelte';

    import {_PATCH} from '../../api/project/[id]/fetch.client.js';

    import Flow from '$lib/flow/Flow.svelte';
    import type {PluginNode} from '$lib/graph/nodes.js';
    import type {PluginEdge} from '$lib/graph/edges.js';

    export let data;

    const project = data.project;

    const save = (nodes: PluginNode[], edges: PluginEdge[]) => {
        _PATCH({
            id: project.id,
            content: {nodes, edges},
        });
    };
</script>

<main>
    <SvelteFlowProvider>
        <Flow {save} actions={data.actions} triggers={data.triggers} initialNodes={project.content.nodes} initialEdges={project.content.edges} />
    </SvelteFlowProvider>
</main>

<style>
    main {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }
</style>
