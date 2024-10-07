<script lang="ts">
    import {onMount} from 'svelte';
    import {writable} from 'svelte/store';
    import {SplitPane} from '@rich_harris/svelte-split-pane';
    import {SvelteFlowProvider} from '@xyflow/svelte';
    import type {MountedComponent} from 'svelte';

    import Flow from '$lib/core/flow/Flow.svelte';
    import Logs from './Logs.svelte';
    import Secrets from './Secrets.svelte';
    import Inspector from './Inspector.svelte';
    import GithubLink from '../../widgets/GithubLink.svelte';
    import ProfileLink from '../../widgets/ProfileLink.svelte';

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

    let flow: MountedComponent<typeof Flow>;
    let saving = $state(false);
    let projectName = $state(data.project.name);
    let saveChecksum = $state(checksum());
    let currentChecksum = $derived.by(() => checksum($nodes, $edges));

    const save = async () => {
        const {nodes, edges} = exportGraph();

        saving = true;
        Promise.all([
            patchProject({
                id: data.project.id,
                name: projectName,
                image: await flow.screenshot(),
                content: {
                    nodes,
                    edges,
                    viewport: flow.getViewport(),
                },
            }),
            new Promise(resolve => setTimeout(resolve, 500)),
        ])
            .then(() => {
                saving = false;
                saveChecksum = checksum(nodes, edges);
            })
            .catch(() => {
                saving = false;
            });
    };

    const prettify = () => flow.prettify();
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
        <input type="text" bind:value={projectName} />
        <div style:flex-grow="1"></div>
        <button class="icon" title="Save" onclick={save} disabled={saving} use:shortcut={['ctrl+s', 'command+s']}>
            <Save />
            {#if !saving && saveChecksum !== currentChecksum}
                <span class="save-indicator"></span>
            {/if}
        </button>
        <button class="icon" title="Copy" onclick={exportToClipboard} use:shortcut={['ctrl+c', 'command+c']} style:display="none">Copy</button>
        <button class="icon" title="Paste" onclick={importFromClipboard} use:shortcut={['ctrl+v', 'command+v']} style:display="none">Paste</button>
        <button class="icon" title="Prettify" onclick={prettify} use:shortcut={'shift+2'}>
            <Prettify />
        </button>
        <button class="icon" title="Fit to view" onclick={fitToView} use:shortcut={'shift+1'}>
            <FitToView />
        </button>
        <ProfileLink />
        <GithubLink />
    </nav>

    <main>
        <SplitPane type="horizontal" min="200px" max="-100px" pos="70%" priority="min" --color="var(--color-bg-1)" --thickness="1rem">
            <section slot="a" class="flow">
                <Flow onNodeClick={showNodes} bind:this={flow} />
            </section>
            <section slot="b" class="sidebar">
                <div class="tabs">
                    <button class:active={projectContext.pane.type === 'nodes'} onclick={showNodes}>
                        <Add />
                        <span>Nodes</span>
                    </button>
                    <button class:active={projectContext.pane.type === 'logs'} onclick={showLogs}>
                        <Console />
                        <span>Logs</span>
                    </button>
                    <button class:active={projectContext.pane.type === 'secrets'} onclick={showSecrets}>
                        <Key />
                        <span>Secrets</span>
                    </button>
                </div>

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
        height: 4rem;
        display: flex;
        padding: 1rem;
        flex-shrink: 0;
        align-items: center;
        border-bottom: 0.15rem solid var(--color-bg-1);

        & input:not(:focus, :hover, :active) {
            background-color: transparent;
        }
    }

    main {
        display: flex;
        overflow: hidden;
        flex-grow: 1;
        flex-direction: column;
    }

    .tabs {
        gap: 1rem;
        padding: 1rem;
        display: flex;
        padding-bottom: unset;
        flex-direction: row;
        justify-content: start;
        overflow-x: auto;
        flex-shrink: 0;

        & button {
            font-size: 0.9rem;
        }

        & button.active {
            color: var(--color-bg);
            background-color: var(--color-fg);
        }
    }

    .sidebar {
        display: flex;
        flex-direction: column;
        border-left: 0.15rem var(--color-bg-1) solid;
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
