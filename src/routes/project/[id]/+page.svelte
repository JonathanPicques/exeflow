<script lang="ts">
    import {onMount} from 'svelte';
    import {writable} from 'svelte/store';
    import {SplitPane} from '@rich_harris/svelte-split-pane';
    import {SvelteFlowProvider} from '@xyflow/svelte';

    import Flow from '$lib/core/flow/Flow.svelte';
    import Logs from './Logs.svelte';
    import Secrets from './Secrets.svelte';
    import Inspector from './Inspector.svelte';
    import GithubLink from '../../widgets/GithubLink.svelte';

    import Add from '$lib/core/widgets/icons/Add.svelte';
    import Key from '$lib/core/widgets/icons/Key.svelte';
    import Save from '$lib/core/widgets/icons/Save.svelte';
    import Close from '$lib/core/widgets/icons/Close.svelte';
    import Console from '$lib/core/widgets/icons/Console.svelte';
    import Prettify from '$lib/core/widgets/icons/Prettify.svelte';
    import FitToView from '$lib/core/widgets/icons/FitToView.svelte';

    import {valid} from '$lib/schema/validate';
    import {shortcut} from '$lib/helper/shortcut';
    import {patchProject} from '../../api/project/project';
    import {setProjectContext} from '$lib/core/core.client.svelte';
    import {graphSchema, setGraphContext} from '$lib/core/core';

    let {data} = $props();
    const nodes = writable(data.project.content.nodes);
    const edges = writable(data.project.content.edges);

    const projectContext = setProjectContext({secrets: data.secrets});
    const {checksum, exportGraph, exportSelection, importSelection} = setGraphContext({
        nodes,
        edges,
        //
        actions: data.actions,
        triggers: data.triggers,
    });

    let flow: Flow;
    let projectName = $state(data.project.name);
    let saveChecksum = $state(checksum());
    let currentChecksum = $derived.by(() => checksum($nodes, $edges));

    const save = async () => {
        const {nodes, edges} = exportGraph();

        patchProject({
            id: data.project.id,
            name: projectName,
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

    const showLogs = () => projectContext.setPane({type: 'logs'});
    const showNodes = () => projectContext.setPane({type: 'nodes'});
    const showSecrets = () => projectContext.setPane({type: 'secrets'});

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
        <a href="/home" class="icon button">
            <Close size="2rem" />
        </a>
        <button class="icon" class:active={projectContext.pane.type === 'nodes'} onclick={showNodes}>
            <Add />
            <span>Nodes</span>
        </button>
        <button class="icon" class:active={projectContext.pane.type === 'logs'} onclick={showLogs}>
            <Console />
            <span>Logs</span>
        </button>
        <button class="icon" class:active={projectContext.pane.type === 'secrets'} onclick={showSecrets}>
            <Key />
            <span>Secrets</span>
        </button>
        <div style:flex-grow="1"></div>
        <input type="text" bind:value={projectName} />
        <div style:flex-grow="1"></div>
        <GithubLink />
    </nav>

    <main>
        <SplitPane type="horizontal" min="200px" max="-100px" pos="75%" priority="min" --color="var(--color-bg-1)" --thickness="1rem">
            <section slot="a" class="flow">
                <Flow bind:this={flow} />
                <div class="sidebar">
                    <button class="icon" title="Save" onclick={save} use:shortcut={'ctrl+s'}>
                        <Save />
                        {#if saveChecksum !== currentChecksum || projectName !== data.project.name}
                            <span class="save-indicator"></span>
                        {/if}
                    </button>
                    <button class="icon" title="Copy" onclick={exportToClipboard} use:shortcut={'ctrl+c'} style:display="none">Copy</button>
                    <button class="icon" title="Paste" onclick={importFromClipboard} use:shortcut={'ctrl+v'} style:display="none">Paste</button>
                    <button class="icon" title="Prettify" onclick={layout} use:shortcut={'ctrl+alt+l'}>
                        <Prettify />
                    </button>
                    <button class="icon" title="Fit to view" onclick={fitToView} use:shortcut={'ctrl+alt+c'}>
                        <FitToView />
                    </button>
                </div>
            </section>
            <section slot="b">
                {#if projectContext.pane.type === 'logs'}
                    <Logs actions={data.actions} triggers={data.triggers} projectId={data.project.id} />
                {/if}
                {#if projectContext.pane.type === 'nodes'}
                    <Inspector />
                {/if}
                {#if projectContext.pane.type === 'secrets'}
                    <Secrets />
                {/if}
            </section>
        </SplitPane>
    </main>
</SvelteFlowProvider>

<style>
    nav {
        gap: 1rem;
        height: 5rem;
        display: flex;
        padding: 1rem;
        flex-shrink: 0;
        align-items: center;
        border-bottom: 1px solid var(--color-bg-1);

        & input:not(:focus, :hover, :active) {
            background-color: transparent;
        }

        & button {
            gap: 0.5rem;

            &.active {
                color: var(--color-fg);
            }
        }
    }

    main {
        display: flex;
        overflow: hidden;
        flex-grow: 1;
        flex-direction: column;
    }

    .sidebar {
        gap: 0.5rem;
        top: 50%;
        left: 0;
        display: flex;
        padding: 0.5rem;
        position: absolute;
        align-items: center;
        border-radius: 0 1rem 1em 0;
        flex-direction: column;
        justify-content: center;

        transform: translate(0, -50%);

        border: 0.15rem solid var(--flow-color-grid-dots);
        border-left: none;
        background-color: var(--color-bg);
    }

    .save-indicator {
        top: -1px;
        right: -1px;
        width: 8px;
        height: 8px;
        position: absolute;
        border-radius: 10rem;

        background-color: var(--color-primary);

        animation: appear 0.3s;
        animation-timing-function: ease-in-out;
        @media screen and (prefers-reduced-motion: reduce) {
            animation: none;
        }
    }

    @keyframes appear {
        0% {
            scale: 0;
        }
        70% {
            scale: 1.4;
        }
        100% {
            scale: 1;
        }
    }
</style>
