<script lang="ts">
    import {getGraphContext} from '$lib/core/core';
    import {getProjectContext} from '$lib/core/core.client.svelte';
    import type {parse} from '$lib/core/parse';

    let props: {interpolations: ReturnType<typeof parse>} = $props();
    let highlight = $state(false);
    let interpolation = $derived(props.interpolations[0]);

    const graphContext = getGraphContext();
    const projectContext = getProjectContext();

    $effect(() => {
        if (highlight && interpolation?.type === 'node') {
            return projectContext.highlightNode(interpolation.id);
        }
    });
</script>

{#if interpolation?.type === 'node'}
    {@const id = interpolation.id}
    {@const node = graphContext.findNode(id)}
    {@const plugin = node && graphContext.getPlugin(node)}

    {#if node && plugin}
        {@const show = () => (highlight = true)}
        {@const hide = () => (highlight = false)}

        <span role="tooltip" class="node" onmouseenter={show} onmouseleave={hide}>
            <img src={plugin.icon} alt="" />
            <span>{id}</span>
        </span>
    {:else}
        <span class="node not-found" title="references a node that no longer exist, you can safely erase it with backspace">Not found</span>
    {/if}
{:else if interpolation?.type === 'secret'}
    {@const key = interpolation.key}
    {@const found = projectContext.secrets.findIndex(s => s.key === key)}

    <span class="secret" class:not-found={!found}>
        <span>🔒</span>
        <span>{interpolation.key}</span>
    </span>
{/if}

<style>
    .node {
        padding: 0.1rem 0.3rem;

        color: var(--color-mention-fg);
        cursor: pointer;
        border-radius: 0.5rem;
        background-color: var(--color-mention-bg);

        img {
            padding-bottom: 0.15rem;
            vertical-align: middle;
        }

        &.not-found {
            color: var(--color-fg);
            background-color: var(--color-error);
        }
    }

    .secret {
        padding: 0.1rem 0.3rem;

        color: var(--color-mention-fg);
        cursor: pointer;
        border-radius: 0.5rem;
        background-color: var(--color-mention-bg);

        &.not-found {
            color: var(--color-fg);
            background-color: var(--color-error);
        }
    }
</style>
