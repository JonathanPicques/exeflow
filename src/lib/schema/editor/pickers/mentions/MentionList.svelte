<script lang="ts">
    import type {JsonSchema} from '$lib/schema/schema';
    import type {PluginNode} from '$lib/core/graph/nodes';
    import {extractPluginName} from '$lib/helper/plugin';

    type EditorMention = NodeEditorMention;
    type NodeEditorMention = {type: 'node'; node: PluginNode; name: string; schema: JsonSchema};

    interface Props {
        mentions: EditorMention[];
        //
        select?: (params: {id: string}) => void;
    }

    let {select, mentions}: Props = $props();

    let selectedIndex = $state(0);
    let clampedSelectedIndex = $derived(selectedIndex % mentions.length);

    const handleSelect = (mention: EditorMention) => {
        select?.({id: `\${node:${mention.node.id}:${mention.name}}`});
    };

    export const key = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            const mention = mentions[clampedSelectedIndex];

            if (mention) {
                select?.({id: `\${node:${mention.node.id}:${mention.name}}`});
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
    export const reset = () => {
        selectedIndex = 0;
    };
</script>

<div class="mentions">
    {#each mentions as mention, i}
        <button class:selected={i === clampedSelectedIndex} onclick={() => handleSelect(mention)}>
            {mention.name} in {extractPluginName(mention.node.data.id)}
        </button>
    {/each}
    {#if mentions.length === 0}
        No results found
    {/if}
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
