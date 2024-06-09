<script lang="ts">
    import {writable} from 'svelte/store';
    import {SplitPane} from '@rich_harris/svelte-split-pane';
    import {SvelteFlowProvider} from '@xyflow/svelte';

    import Flow from '$lib/flow/Flow.svelte';
    import Inspector from './Inspector.svelte';

    import {valid} from '$lib/schema/validate';
    import {shortcut} from '$lib/helper/shortcut';
    import {fetchUpdateProject} from '../../api/project/project.api';
    import {graphSchema, setGraphContext} from '$lib/core/core';

    let flow: Flow;
    let {data} = $props();

    const nodes = writable(data.project.content.nodes);
    const edges = writable(data.project.content.edges);

    const {exportGraph, importGraph} = setGraphContext({
        nodes,
        edges,
        //
        actions: data.actions,
        triggers: data.triggers,
    });

    const save = () => {
        fetchUpdateProject({
            id: data.project.id,
            content: {
                nodes: $nodes,
                edges: $edges,
            },
        });
    };

    const layout = () => flow.layout();
    const fitToView = () => flow.fitToView();

    const exportToClipboard = () => {
        const data = exportGraph($nodes.filter(n => n.selected).map(n => n.id));
        if (valid(data, graphSchema)) {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        }
    };
    const importFromClipboard = () => {
        navigator.clipboard.readText().then(text => {
            const data = JSON.parse(text);
            if (valid(data, graphSchema)) {
                importGraph(data);
            }
        });
    };
</script>

<svelte:head>
    <title>Exeflow</title>
</svelte:head>

<SvelteFlowProvider>
    <main>
        <nav>
            <button onclick={save} use:shortcut={'ctrl+s'}>Save</button>
            <button onclick={layout} use:shortcut={'ctrl+alt+l'}>Layout</button>
            <button onclick={fitToView} use:shortcut={'ctrl+alt+c'}>Fit to view</button>
            {#if true}
                <button onclick={exportToClipboard} use:shortcut={'ctrl+c'}>Copy</button>
                <button onclick={importFromClipboard} use:shortcut={'ctrl+v'}>Paste</button>
            {/if}
        </nav>
        <SplitPane type="horizontal" min="200px" max="-100px" pos="80%" priority="min" --color="var(--color-bg-1)" --thickness="1rem">
            <section slot="a" class="flow">
                <Flow bind:this={flow} />
            </section>
            <section slot="b" class="inspector">
                <Inspector />
            </section>
        </SplitPane>
    </main>
</SvelteFlowProvider>

<style>
    main {
        height: 100%;
        display: flex;
        overflow: hidden;
        flex-grow: 1;
        flex-direction: column;

        & > :global(div) > :global(.container) {
            /** Fix svelte-split-pane overflow in panes */
            overflow: hidden;
        }
    }

    nav {
        gap: 1rem;
        display: flex;
        padding: 1rem;
        border-bottom: 1px solid var(--color-bg-1);
    }

    .inspector {
        padding: 1rem;
    }
</style>
