<script lang="ts">
    import {onMount} from 'svelte';
    import {SplitPane} from '@rich_harris/svelte-split-pane';
    import {SvelteFlowProvider} from '@xyflow/svelte';
    import type {MountedComponent} from 'svelte';

    import Flow from '$lib/core/flow/Flow.svelte';
    import GithubLink from '$lib/core/widgets/GithubLink.svelte';
    import ProfileLink from '$lib/core/widgets/ProfileLink.svelte';
    import InspectorLogs from './inspectors/Logs.svelte';
    import InspectorNodes from './inspectors/Nodes.svelte';
    import InspectorSecrets from './inspectors/Secrets.svelte';

    import Add from '$lib/core/widgets/icons/Add.svelte';
    import Key from '$lib/core/widgets/icons/Key.svelte';
    import Save from '$lib/core/widgets/icons/Save.svelte';
    import Home from '$lib/core/widgets/icons/Home.svelte';
    import Close from '$lib/core/widgets/icons/Close.svelte';
    import Trash from '$lib/core/widgets/icons/Trash.svelte';
    import Console from '$lib/core/widgets/icons/Console.svelte';
    import Sidebar from '$lib/core/widgets/icons/Sidebar.svelte';
    import Prettify from '$lib/core/widgets/icons/Prettify.svelte';
    import Duplicate from '$lib/core/widgets/icons/Duplicate.svelte';
    import FitToView from '$lib/core/widgets/icons/FitToView.svelte';

    import {wait} from '$lib/core/helper/function';
    import {valid} from '$lib/core/schema/validate';
    import {shortcut} from '$lib/core/helper/shortcut';
    import {patchProject} from '../../api/project/project';
    import {setProjectContext} from '$lib/core/core.client.svelte';
    import {graphSchema, setGraphContext} from '$lib/core/core';

    type Length = `${number}%`;

    let {data} = $props();

    const projectContext = setProjectContext({secrets: data.secrets, sidebar: !data.mobileHint});
    const {nodes, edges, checksum, exportGraph, exportSelection, importSelection} = setGraphContext({
        nodes: data.project.content.nodes,
        edges: data.project.content.edges,
        actions: data.actions,
        triggers: data.triggers,
    });

    let flow: MountedComponent<typeof Flow>;

    let saveChecksum = $state(checksum());
    let currentChecksum = $derived.by(() => checksum($nodes, $edges));

    let saving = $state(false);
    let projectName = $state(data.project.name);

    let mobile = $state(data.mobileHint); // (width <= 932px)
    const hasSelection = $derived($nodes.some(n => n.selected));
    const targetSidebarPos: Length = $derived(projectContext.sidebar ? (mobile ? '0%' : '65%') : '100%');

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
            wait(500),
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
    const removeSelection = () => {
        nodes.update(nodes => nodes.filter(n => !n.selected));
    };
    const duplicateSelection = () => {
        importSelection(exportSelection($nodes.filter(n => n.selected).map(n => n.id)));
    };

    const showLogs = () => projectContext.setTab({type: 'logs'});
    const showNodes = () => projectContext.setTab({type: 'nodes'});
    const showSecrets = () => projectContext.setTab({type: 'secrets'});

    const exportToClipboard = async () => {
        const data = exportSelection($nodes.filter(n => n.selected).map(n => n.id));
        if (valid(data, graphSchema)) {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        }
    };
    const importFromClipboard = async () => {
        navigator.clipboard.readText().then(text => {
            const data = JSON.parse(text);
            if (valid(data, graphSchema)) {
                importSelection(data);
            }
        });
    };

    $effect(() => {
        if (saveChecksum !== currentChecksum) {
            const listener = (e: BeforeUnloadEvent) => {
                e.preventDefault();
            };
            window.addEventListener('beforeunload', listener);
            return () => {
                window.removeEventListener('beforeunload', listener);
            };
        }
    });

    onMount(() => {
        const {viewport} = data.project.content;

        if (viewport) {
            flow.setViewport(viewport);
        }
    });

    onMount(() => {
        const media = matchMedia(`(width <= 932px)`);
        const listener = ({matches}: {matches: boolean}) => {
            mobile = matches;
        };

        listener(media);
        media.addEventListener('change', listener);
        return () => {
            media.removeEventListener('change', listener);
        };
    });
</script>

<svelte:head>
    <title>Exeflow - {projectName || 'Untitled project'}</title>
</svelte:head>

{#snippet HomeButton()}
    <a href="/home" role="button" class="icon button" aria-label="Back to home">
        <Home />
    </a>
{/snippet}
{#snippet SaveButton()}
    <button class="icon" title="Save" onclick={save} disabled={saving} use:shortcut={['ctrl+s', 'command+s']}>
        <Save />
        {#if !saving && saveChecksum !== currentChecksum}
            <span class="save-indicator"></span>
        {/if}
    </button>
{/snippet}
{#snippet CopyButton()}
    <button class="icon" title="Copy" onclick={exportToClipboard} use:shortcut={['ctrl+c', 'command+c']} style:display="none">Copy</button>
{/snippet}
{#snippet PasteButton()}
    <button class="icon" title="Paste" onclick={importFromClipboard} use:shortcut={['ctrl+v', 'command+v']} style:display="none">Paste</button>
{/snippet}
{#snippet SidebarButton()}
    <button class="icon" title="Show sidebar" onclick={projectContext.showSidebar} use:shortcut={['ctrl+shift+i', 'command+shift+i']}>
        <Sidebar />
    </button>
{/snippet}
{#snippet PrettifyButton()}
    <button class="icon" title="Prettify" onclick={prettify} use:shortcut={'shift+2'}>
        <Prettify />
    </button>
{/snippet}
{#snippet FitToViewButton()}
    <button class="icon" title="Fit to view" onclick={fitToView} use:shortcut={'shift+1'}>
        <FitToView />
    </button>
{/snippet}
{#snippet RemoveSelectionButton()}
    <button class="icon" title="Remove selection" onclick={removeSelection} disabled={!hasSelection}>
        <Trash />
    </button>
{/snippet}
{#snippet DuplicateSelectionButton()}
    <button class="icon" title="Duplicate selection" onclick={duplicateSelection} disabled={!hasSelection} use:shortcut={['ctrl+d', 'command+d']}>
        <Duplicate />
    </button>
{/snippet}

{#snippet NavbarMobile()}
    <nav class="top">
        <div class="island">
            {@render HomeButton()}
        </div>
        <div style:flex-grow="1"></div>
        <div class="island">
            <ProfileLink />
            <GithubLink />
        </div>
        {#if !projectContext.sidebar}
            <div class="island">
                {@render SidebarButton()}
            </div>
        {/if}
    </nav>

    <nav class="bottom">
        <div class="island">
            {@render SaveButton()}
            {@render CopyButton()}
            {@render PasteButton()}
            {@render PrettifyButton()}
            {@render FitToViewButton()}
            {@render RemoveSelectionButton()}
            {@render DuplicateSelectionButton()}
        </div>
    </nav>
{/snippet}
{#snippet NavbarDesktop()}
    <nav class="top">
        <div class="island">
            {@render HomeButton()}
        </div>
        <div class="island">
            <input type="text" aria-label="Project name" placeholder="Untitled project..." bind:value={projectName} />
        </div>
        <div class="island">
            {@render SaveButton()}
            {@render CopyButton()}
            {@render PasteButton()}
            {@render PrettifyButton()}
            {@render FitToViewButton()}
            {@render RemoveSelectionButton()}
            {@render DuplicateSelectionButton()}
        </div>
        <div style:flex-grow="1"></div>
        <div class="island">
            <ProfileLink />
            <GithubLink />
        </div>
        {#if !projectContext.sidebar}
            <div class="island">
                {@render SidebarButton()}
            </div>
        {/if}
    </nav>
{/snippet}

<SvelteFlowProvider>
    <main>
        <SplitPane pos={targetSidebarPos} type="horizontal" disabled={mobile} --color="var(--color-bg-1)" --thickness="2rem">
            {#snippet a()}
                <section class="flow">
                    <Flow onNodeClick={showNodes} bind:this={flow} />
                    {@render (mobile ? NavbarMobile : NavbarDesktop)()}
                </section>
            {/snippet}
            {#snippet b()}
                <section class="sidebar">
                    <div class="tabs">
                        {#if projectContext.sidebar}
                            <button class="icon" title="Close sidebar" onclick={projectContext.hideSidebar} use:shortcut={['ctrl+shift+i', 'command+shift+i']}>
                                <Close />
                            </button>
                        {/if}
                        <button class:active={projectContext.tab.type === 'nodes'} onclick={showNodes}>
                            <Add />
                            <span>Nodes</span>
                        </button>
                        <button class:active={projectContext.tab.type === 'logs'} onclick={showLogs}>
                            <Console />
                            <span>Logs</span>
                        </button>
                        <button class:active={projectContext.tab.type === 'secrets'} onclick={showSecrets}>
                            <Key />
                            <span>Secrets</span>
                        </button>
                    </div>

                    {#if projectContext.tab.type === 'logs'}
                        <InspectorLogs actions={data.actions} triggers={data.triggers} projectId={data.project.id} />
                    {/if}
                    {#if projectContext.tab.type === 'nodes'}
                        <InspectorNodes />
                    {/if}
                    {#if projectContext.tab.type === 'secrets'}
                        <InspectorSecrets />
                    {/if}
                </section>
            {/snippet}
        </SplitPane>
    </main>
</SvelteFlowProvider>

<style>
    main {
        display: flex;
        overflow: hidden;
        flex-grow: 1;
        flex-direction: column;
    }

    .flow {
        position: relative;

        nav {
            position: absolute;
            left: 0;
            right: 0;

            gap: 0.5rem;
            display: flex;
            padding: 0.7rem; /* magic number to align with tabs */
            overflow: auto;
            user-select: none;

            &.top {
                top: 0;
            }

            &.bottom {
                bottom: 0;
            }

            & .island {
                display: flex;

                gap: 1rem;
                border: 0.15rem solid var(--color-bg-1);
                margin: auto;
                box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.25);
                border-radius: 10rem;
                padding-block: 0.5rem;
                padding-inline: 1.25rem;
                justify-content: center;
                background-color: var(--color-bg);

                input {
                    all: unset;
                    color: var(--color-fg);
                    height: 2rem; /* magic number to align with icon buttons */

                    &::placeholder {
                        color: var(--color-fg-1);
                        user-select: none;
                    }
                }
            }
        }
    }

    .sidebar {
        display: flex;
        flex-direction: column;

        @media (width > 932px) {
            border-left: 0.15rem var(--color-bg-1) solid;
        }

        .tabs {
            gap: 1rem;
            display: flex;
            padding: 1rem; /* magic number to align with navbar */
            overflow-x: auto;
            overflow-y: hidden;
            flex-shrink: 0;
            flex-direction: row;
            justify-content: start;

            border-bottom: 0.15rem var(--color-bg-1) solid;

            & button {
                font-size: 0.9rem;
            }

            & button.active {
                color: var(--color-bg);
                background-color: var(--color-fg);
            }
        }
    }

    .save-indicator {
        position: absolute;
        top: 0;
        right: 0;

        width: 8px;
        height: 8px;
        border-radius: 10rem;

        background-color: var(--color-primary);

        animation: appear 0.3s;
        animation-timing-function: ease-in-out;
        @media (prefers-reduced-motion: reduce) {
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
