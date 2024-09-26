<script lang="ts">
    import {getGraphContext} from '$lib/core/core';
    import {getProjectContext} from '$lib/core/core.client.svelte';
    import {extractPluginName, nodeInterpolation, secretInterpolation} from '$lib/core/parse';
    import type {JsonSchema} from '$lib/schema/schema';
    import type {PluginNode} from '$lib/core/graph/nodes';

    type EditorMention = NodeEditorMention | SecretEditorMention;
    type NodeEditorMention = {type: 'node'; node: PluginNode; key: string; schema: JsonSchema};
    type SecretEditorMention = {type: 'secret'; key: string};

    interface Props {
        mentions: EditorMention[];
        //
        select?: (params: {id: string}) => void;
    }

    let {select, mentions}: Props = $props();

    let hidden = $state(false);
    let selectedIndex = $state(0);

    const handleSelect = (mention: EditorMention) => {
        switch (mention.type) {
            case 'node':
                select?.({id: nodeInterpolation(mention.node.id, mention.key)});
                break;
            case 'secret':
                select?.({id: secretInterpolation(mention.key)});
                break;
            default:
                throw new Error('unreachable');
        }
    };
    const {findPlugin} = getGraphContext();
    const {highlightNode} = getProjectContext();

    $effect(() => {
        if (selectedIndex < 0 || selectedIndex > mentions.length) {
            selectedIndex = Math.max(0, Math.min(selectedIndex, mentions.length - 1));
        }
    });
    $effect(() => {
        if (hidden) return;

        const mention = mentions[selectedIndex];

        if (mention?.type === 'node') {
            return highlightNode(mention.node.id);
        }
    });

    export const key = (e: KeyboardEvent) => {
        if (hidden) return false;
        if (e.key === 'Enter') {
            const mention = mentions[selectedIndex];

            if (mention) {
                handleSelect(mention);
                return true;
            }
        }
        if (e.key === 'ArrowUp') {
            if (selectedIndex === 0) selectedIndex = Math.max(0, mentions.length - 1);
            else selectedIndex -= 1;
            return true;
        }
        if (e.key === 'ArrowDown') {
            if (selectedIndex === mentions.length - 1) selectedIndex = 0;
            else selectedIndex += 1;
            return true;
        }
        return false;
    };
    export const hide = () => {
        hidden = true;
        reset();
    };
    export const show = () => {
        hidden = false;
        reset();
    };
    export const reset = () => {
        selectedIndex = 0;
    };
</script>

<div class="mentions">
    {#if mentions.length === 0}
        No results found
    {/if}
    {#each mentions as mention, i}
        {#if mention.type === 'node'}
            {@const {icon} = findPlugin(mention.node)}
            <button class:selected={i === selectedIndex} onclick={() => handleSelect(mention)}>
                <img src={icon} alt="" />
                <span>{mention.key} in {extractPluginName(mention.node.data.id)}</span>
            </button>
        {:else}
            <button class:selected={i === selectedIndex} onclick={() => handleSelect(mention)}>
                <span>🔒</span>
                <span>{mention.key}</span>
            </button>
        {/if}
    {/each}
</div>

<style>
    div {
        gap: 0.5rem;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;

        border: 0.15rem solid var(--color-fg);
        border-radius: 0.5rem;
        background-color: var(--color-bg);
    }

    button {
        gap: 1rem;
        display: flex;
    }

    .selected {
        background-color: var(--color-bg-2);
    }
</style>
