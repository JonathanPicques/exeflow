<script lang="ts">
    import {useEdges} from '@xyflow/svelte';
    import type {NodeProps} from '@xyflow/svelte';

    import OutputHandle from '../edges/OutputHandle.svelte';

    import {getGraphContext} from '$lib/core/core';
    import {getProjectContext} from '$lib/core/core.client.svelte';
    import {humanPluginName, extractPluginName, extractPluginNamespace} from '$lib/core/parser/parser';
    import type {TriggerNode} from '$lib/core/core';

    let {id, data, selected}: NodeProps<TriggerNode> = $props();
    const edges = useEdges();
    const {triggers} = getGraphContext();
    const projectContext = getProjectContext();

    const {icon, name, color} = triggers[data.id]!;
    const {valid, title, outputs} = $derived(data.data);

    const nodeName = $derived(name ?? humanPluginName(extractPluginName(data.id)));
    const nodeTitle = $derived(title);
    const nodeNamespace = $derived(humanPluginName(extractPluginNamespace(data.id)));

    const connectedOutputs = $derived([...new Set($edges.filter(e => e.source === id).map(e => e.sourceHandle))] as string[]);
</script>

<div role="presentation" class="node" ondblclick={projectContext.showSidebar} style:--x-color-border={selected ? color : 'transparent'} style:--x-color-plugin={color}>
    <div></div>
    <img src={icon} alt="" title={nodeNamespace} width="32px" height="32px" />
    <div class="outputs">
        {#each outputs as output}
            <OutputHandle id={output} connected={connectedOutputs.includes(output)} />
        {/each}
    </div>
</div>

<div class="content">
    <span title={nodeName} class="name" class:valid>{nodeName}</span>
    <span title={nodeTitle} class="title" class:valid>{nodeTitle}</span>
</div>

<style>
    .node::before {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        content: '';
        opacity: 0.1;
        border-radius: calc(var(--flow-border-radius-node) - 0.15rem);
        pointer-events: none;
        background-image: linear-gradient(to bottom, transparent, var(--x-color-plugin));
    }
    .node {
        position: relative;

        gap: 1rem;
        width: fit-content;
        display: flex;
        padding: 0.5rem 0.2rem;
        margin-inline: auto;

        border: 0.15rem solid var(--x-color-border, transparent);
        border-radius: var(--flow-border-radius-node);
        background-color: var(--flow-color-node);
    }

    .content {
        height: 2rem;
        display: flex;
        text-align: center;
        flex-direction: column;

        & .name {
            color: var(--color-fg);
            font-weight: bold;

            overflow: hidden;
            max-width: 10rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 0.8rem;

            &:not(.valid) {
                color: var(--color-error);
            }
        }
        & .title {
            color: var(--color-fg-1);
            font-size: 0.6rem;
            font-weight: 200;

            overflow: hidden;
            max-width: 10rem;
            white-space: nowrap;
            text-overflow: ellipsis;

            &:not(.valid) {
                color: var(--color-error);
            }
        }
    }

    .outputs {
        gap: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    :global(.highlight) {
        animation: glow infinite 2s;

        @media (prefers-reduced-motion) {
            animation: none;
            box-shadow: 0 0 1.5rem var(--x-color-plugin);
        }
    }

    @keyframes glow {
        0% {
            box-shadow: 0 0 1rem var(--x-color-plugin);
        }
        50% {
            box-shadow: 0 0 1.5rem var(--x-color-plugin);
        }
        100% {
            box-shadow: 0 0 1rem var(--x-color-plugin);
        }
    }
</style>
