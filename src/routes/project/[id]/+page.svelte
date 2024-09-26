<script lang="ts">
    import {onMount} from 'svelte';
    import {writable} from 'svelte/store';
    import {SplitPane} from '@rich_harris/svelte-split-pane';
    import {SvelteFlowProvider} from '@xyflow/svelte';

    import Flow from '$lib/core/flow/Flow.svelte';
    import Logs from './Logs.svelte';
    import Secrets from './Secrets.svelte';
    import Inspector from './Inspector.svelte';

    import {valid} from '$lib/schema/validate';
    import {shortcut} from '$lib/helper/shortcut';
    import {patchProject} from '../../api/project/project';
    import {setProjectContext} from '$lib/core/core.client.svelte';
    import {graphSchema, setGraphContext} from '$lib/core/core';

    let flow: Flow;
    let dialogLogs: HTMLDialogElement;
    let dialogSecrets: HTMLDialogElement;

    let {data} = $props();

    const nodes = writable(data.project.content.nodes);
    const edges = writable(data.project.content.edges);

    setProjectContext({secrets: data.secrets});
    const {checksum, exportGraph, exportSelection, importSelection} = setGraphContext({
        nodes,
        edges,
        //
        actions: data.actions,
        triggers: data.triggers,
    });

    let saveChecksum = $state(checksum());
    let currentChecksum = $derived.by(() => checksum($nodes, $edges));

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
        }).then(() => {
            saveChecksum = checksum(nodes, edges);
        });
    };

    const layout = () => flow.layout();
    const fitToView = () => flow.fitToView();

    const showLogs = () => dialogLogs.showModal();
    const closeLogs = () => dialogLogs.close();

    const showSecrets = () => dialogSecrets.showModal();
    const closeSecrets = () => dialogSecrets.close();

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
    <title>Exeflow - {data.project.name}</title>
</svelte:head>

<SvelteFlowProvider>
    <nav>
        <button onclick={save} use:shortcut={'ctrl+s'}>
            {#if saveChecksum === currentChecksum}Save{/if}
            {#if saveChecksum !== currentChecksum}Save *{/if}
        </button>
        <button onclick={layout} use:shortcut={'ctrl+alt+l'}>Layout</button>
        <button onclick={fitToView} use:shortcut={'ctrl+alt+c'}>Fit to view</button>
        {#if true}
            <button onclick={showLogs}>Logs</button>
        {/if}
        {#if true}
            <button onclick={showSecrets}>Secrets</button>
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

    <dialog bind:this={dialogLogs}>
        <div class="title">
            <h1>Executions logs</h1>
            <button onclick={closeLogs} style:align-self="end">✖</button>
        </div>
        <Logs actions={data.actions} triggers={data.triggers} projectId={data.project.id} />
    </dialog>

    <dialog bind:this={dialogSecrets}>
        <div class="title">
            <h1>Secrets</h1>
            <button onclick={closeSecrets} style:align-self="end">✖</button>
        </div>
        <Secrets />
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

    dialog {
        padding: 1rem;

        &:modal {
            gap: 1rem;
            display: flex;
            flex-direction: column;
        }

        & .title {
            gap: 1rem;
            display: flex;
            align-items: center;

            & h1 {
                flex-grow: 1;
            }
        }
    }

    .inspector {
        padding: 1rem;
    }
</style>
