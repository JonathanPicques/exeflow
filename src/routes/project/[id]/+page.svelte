<script lang="ts">
    import {writable} from 'svelte/store';
    import {SplitPane} from '@rich_harris/svelte-split-pane';
    import {SvelteFlowProvider} from '@xyflow/svelte';
    import type {KeyboardEventHandler} from 'svelte/elements';

    import Flow from '$lib/flow/Flow.svelte';
    import Inspector from './Inspector.svelte';
    import {setGraphContext} from '$lib/graph/data';
    import {fetchUpdateProject} from '../../api/project.api';

    let flow: Flow;
    let {data} = $props();

    const nodes = writable(data.project.content.nodes);
    const edges = writable(data.project.content.edges);
    const values = writable(data.project.content.values);

    const keydown: KeyboardEventHandler<Window> = e => {
        if (e.key === 'c') {
            flow.fitToView();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
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
        } else if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'l') {
            flow.layout();
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

<svelte:head>
    <title>Exeflow</title>
</svelte:head>
<svelte:window on:keydown={keydown} />

<SvelteFlowProvider>
    <SplitPane type="horizontal" pos="80%" min="200px" max="-100px" priority="min" --color="var(--color-bg-1)" --thickness="1rem">
        <section slot="a" class="flow">
            <Flow bind:this={flow} />
        </section>
        <section slot="b" class="inspector">
            <Inspector />
        </section>
    </SplitPane>
</SvelteFlowProvider>

<style>
    .inspector {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        flex-wrap: wrap;
        align-content: start;
    }
</style>
