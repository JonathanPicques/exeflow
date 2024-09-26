<script lang="ts">
    import {useEdges} from '@xyflow/svelte';
    import type {NodeProps} from '@xyflow/svelte';

    import OutputHandle from '../edges/OutputHandle.svelte';

    import {getGraphContext} from '$lib/core/core';
    import {humanPluginName, extractPluginName, extractPluginNamespace} from '$lib/core/parse';
    import type {TriggerNode} from '$lib/core/graph/nodes';

    let {id, data, selected = undefined}: NodeProps<TriggerNode> = $props();
    const edges = useEdges();
    const {triggers} = getGraphContext();

    const {icon, name, color} = triggers[data.id]!;
    const {valid, title, outputs} = $derived(data.data);

    const nodeName = $derived(name ?? humanPluginName(extractPluginName(data.id)));
    const nodeTitle = $derived(title);
    const nodeNamespace = $derived(humanPluginName(extractPluginNamespace(data.id)));

    const connectedOutputs = $derived([...new Set($edges.filter(e => e.source === id).map(e => e.sourceHandle))] as string[]);
</script>

<div class="node" style:--x-color-border={selected ? color : 'transparent'} style:--x-color-plugin={color}>
    <div class="content">
        <img src={icon} alt="" title={nodeNamespace} width="32px" height="32px" />
        <div>
            <span class:valid class="name">{nodeName}</span>
            {#if nodeTitle && nodeName !== nodeTitle}
                <span class:valid class="title">{nodeTitle}</span>
            {/if}
        </div>
    </div>
    <div class="outputs">
        {#each outputs as output}
            <OutputHandle id={output} connected={connectedOutputs.includes(output)}>
                {#if outputs.length > 1}
                    {output}
                {/if}
            </OutputHandle>
        {/each}
    </div>
</div>

<style>
    .node {
        gap: 1rem;
        display: flex;
        padding: 0.5rem;
        min-width: 10rem;

        border: 0.15rem solid var(--x-color-border, transparent);
        border-radius: var(--flow-border-radius-node);
        background-color: var(--flow-color-node);
    }

    .content {
        gap: 1rem;
        display: flex;
        flex-grow: 1;
        align-items: center;

        & div {
            gap: 0.2rem;
            display: flex;
            flex-direction: column;

            & .name {
                color: var(--color-fg);
                font-weight: bold;

                &:not(.valid) {
                    color: var(--color-error);
                }
            }
            & .title {
                color: var(--color-fg-1);
                font-size: 0.6rem;
                font-weight: 200;

                &:not(.valid) {
                    color: var(--color-error);
                }
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

        @media screen and (prefers-reduced-motion: reduce) {
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
