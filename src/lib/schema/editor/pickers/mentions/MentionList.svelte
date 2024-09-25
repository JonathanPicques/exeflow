<script lang="ts">
    import {extractPluginName} from '$lib/helper/plugin';
    import {getProjectContext} from '$lib/core/core.client.svelte';
    import {nodeInterpolation, secretInterpolation} from '$lib/helper/parse';
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
    let clampedSelectedIndex = $derived(selectedIndex % mentions.length);

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
    const {highlightNode} = getProjectContext();

    $effect(() => {
        if (hidden) return;

        const mention = mentions[clampedSelectedIndex];

        if (mention?.type === 'node') {
            return highlightNode(mention.node.id);
        }
    });

    export const key = (e: KeyboardEvent) => {
        if (hidden) return false;
        if (e.key === 'Enter') {
            const mention = mentions[clampedSelectedIndex];

            if (mention) {
                handleSelect(mention);
                return true;
            }
        }
        if (e.key === 'ArrowUp') {
            selectedIndex -= 1;
            return true;
        }
        if (e.key === 'ArrowDown') {
            selectedIndex += 1;
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
            <button class:selected={i === clampedSelectedIndex} onclick={() => handleSelect(mention)}>
                {mention.key} in {extractPluginName(mention.node.data.id)}
            </button>
        {:else}
            <button class:selected={i === clampedSelectedIndex} onclick={() => handleSelect(mention)}>
                🔒 {mention.key}
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

    .selected {
        background-color: var(--color-bg-2);
    }
</style>
