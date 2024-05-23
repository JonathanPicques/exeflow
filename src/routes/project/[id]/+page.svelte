<script lang="ts">
    import {writable} from 'svelte/store';
    import {SplitPane} from '@rich_harris/svelte-split-pane';
    import {SvelteFlowProvider} from '@xyflow/svelte';
    import type {KeyboardEventHandler} from 'svelte/elements';

    import Flow from '$lib/flow/Flow.svelte';
    import Inspector from './Inspector.svelte';

    import {valid} from '$lib/schema/validate';
    import {fetchUpdateProject} from '../../api/project/project.api';
    import {graphSchema, setGraphContext} from '$lib/graph/data';

    let flow: Flow;
    let {data} = $props();

    const nodes = writable(data.project.content.nodes);
    const edges = writable(data.project.content.edges);

    const {exportNodes, importNodes} = setGraphContext({
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

    const keydown: KeyboardEventHandler<Window> = e => {
        if (!e.ctrlKey && !e.metaKey && e.key === 'c') {
            e.preventDefault();
            flow.fitToView();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            exportToClipboard();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault();
            importFromClipboard();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            save();
        } else if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'l') {
            e.preventDefault();
            flow.layout();
        }
    };

    const exportToClipboard = () => {
        const data = exportNodes($nodes.filter(n => n.selected).map(n => n.id));
        if (valid(data, graphSchema)) {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        }
    };
    const importFromClipboard = () => {
        navigator.clipboard.readText().then(text => {
            const data = JSON.parse(text);
            if (valid(data, graphSchema)) {
                importNodes(data);
            }
        });
    };
</script>

<svelte:head>
    <title>Exeflow</title>
</svelte:head>
<svelte:window on:keydown={keydown} />

<SvelteFlowProvider>
    <main>
        <nav>
            <button onclick={save}>Save</button>
            <button onclick={() => flow.layout()}>Layout</button>
            <button onclick={() => flow.fitToView()}>Fit to view</button>
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
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }

    nav {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid var(--color-bg-1);
    }

    .inspector {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        flex-wrap: wrap;
        align-content: start;
    }
</style>
