<script lang="ts">
    import {onMount} from 'svelte';
    import {writable} from 'svelte/store';
    import {SplitPane} from '@rich_harris/svelte-split-pane';
    import {SvelteFlowProvider} from '@xyflow/svelte';

    import Flow from '$lib/flow/Flow.svelte';
    import Logs from './Logs.svelte';
    import Inspector from './Inspector.svelte';

    import {valid} from '$lib/schema/validate';
    import {shortcut} from '$lib/helper/shortcut';
    import {patchProject} from '../../api/project/project';
    import {graphSchema, setGraphContext} from '$lib/core/core';

    let flow: Flow;
    let dialog: HTMLDialogElement;

    let {data} = $props();

    const nodes = writable(data.project.content.nodes);
    const edges = writable(data.project.content.edges);

    const {exportGraph, exportSelection, importSelection} = setGraphContext({
        nodes,
        edges,
        //
        actions: data.actions,
        triggers: data.triggers,
    });

    const save = async () => {
        const {nodes, edges} = exportGraph();

        patchProject({
            id: data.project.id,
            image: await flow.screenshot(),
            content: {
                nodes,
                edges,
                viewport: flow.getViewport(),
            },
        });
    };

    const layout = () => flow.layout();
    const fitToView = () => flow.fitToView();

    const showLogs = () => dialog.showModal();
    const closeLogs = () => dialog.close();

    const exportToClipboard = () => {
        const data = exportSelection($nodes.filter(n => n.selected).map(n => n.id));
        if (valid(data, graphSchema)) {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        }
    };
    const importFromClipboard = () => {
        navigator.clipboard.readText().then(text => {
            const data = JSON.parse(text);
            if (valid(data, graphSchema)) {
                importSelection(data);
            }
        });
    };

    onMount(() => {
        const {viewport} = data.project.content;

        if (viewport) {
            flow.setViewport(viewport);
        }
    });
</script>

<svelte:head>
    <title>Exeflow</title>
</svelte:head>

<SvelteFlowProvider>
    <nav>
        <button onclick={save} use:shortcut={'ctrl+s'}>Save</button>
        <button onclick={layout} use:shortcut={'ctrl+alt+l'}>Layout</button>
        <button onclick={fitToView} use:shortcut={'ctrl+alt+c'}>Fit to view</button>
        {#if true}
            <button onclick={showLogs}>Logs</button>
        {/if}
        {#if true}
            <button onclick={exportToClipboard} use:shortcut={'ctrl+c'}>Copy</button>
            <button onclick={importFromClipboard} use:shortcut={'ctrl+v'}>Paste</button>
        {/if}
    </nav>

    <main>
        <SplitPane type="horizontal" min="200px" max="-100px" pos="75%" priority="min" --color="var(--color-bg-1)" --thickness="1rem">
            <section slot="a" class="flow">
                <Flow bind:this={flow} />
            </section>
            <section slot="b" class="inspector">
                <Inspector />
            </section>
        </SplitPane>
    </main>

    <dialog bind:this={dialog}>
        <Logs actions={data.actions} triggers={data.triggers} projectId={data.project.id} />
        <button onclick={closeLogs}>Close</button>
    </dialog>
</SvelteFlowProvider>

<style>
    nav {
        gap: 1rem;
        display: flex;
        padding: 1rem;
        border-bottom: 1px solid var(--color-bg-1);
    }

    main {
        display: flex;
        overflow: hidden;
        flex-grow: 1;
        flex-direction: column;
    }

    dialog:modal {
        gap: 1rem;
        display: flex;
        flex-direction: column;
    }

    .inspector {
        padding: 1rem;
    }
</style>
