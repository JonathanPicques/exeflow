<script lang="ts">
    import {writable} from 'svelte/store';
    import {SvelteFlowProvider} from '@xyflow/svelte';
    import type {KeyboardEventHandler} from 'svelte/elements';

    import Flow from '$lib/flow/Flow.svelte';
    import {setGraphContext} from '$lib/graph/data.js';
    import {fetchUpdateProject} from '../../api/project.api.js';

    let {data} = $props();

    const nodes = writable(data.project.content.nodes);
    const edges = writable(data.project.content.edges);
    const values = writable(data.project.content.values);

    const keydown: KeyboardEventHandler<Window> = e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            fetchUpdateProject({
                id: data.project.id,
                content: {
                    nodes: $nodes,
                    edges: $edges,
                    values: $values,
                },
            });
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            nodes.set(data.project.content.nodes);
            edges.set(data.project.content.edges);
            values.set(data.project.content.values);
        }
    };

    setGraphContext({
        nodes,
        edges,
        values,
        //
        actions: data.actions,
        triggers: data.triggers,
    });
</script>

<svelte:window on:keydown={keydown} />

<main>
    <SvelteFlowProvider>
        <Flow initialFitView={data.project.content.nodes.length > 0} />
    </SvelteFlowProvider>
</main>

<style>
    main {
        flex-grow: 1;
    }
</style>
