<script lang="ts">
    import {writable} from 'svelte/store';
    import {SvelteFlowProvider} from '@xyflow/svelte';
    import type {KeyboardEventHandler} from 'svelte/elements';

    import {_PATCH} from '../../api/project/[id]/fetch.client.js';

    import Flow from '$lib/flow/Flow.svelte';
    import {setGraphContext} from '$lib/graph/data.js';

    export let data;

    const nodes = writable(data.project.content.nodes);
    const edges = writable(data.project.content.edges);
    const context = setGraphContext({
        nodes,
        edges,
        actions: data.actions,
        triggers: data.triggers,
    });

    const keydown: KeyboardEventHandler<Window> = e => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            _PATCH({
                id: data.project.id,
                content: {nodes: $nodes, edges: $edges},
            });
        } else if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            nodes.set(data.project.content.nodes);
            edges.set(data.project.content.edges);
        }
    };
</script>

<svelte:window on:keydown={keydown} />

<main>
    <SvelteFlowProvider>
        <Flow initialFitView={data.project.content.nodes.length > 0} />
    </SvelteFlowProvider>
</main>

<style>
    main {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }
</style>
