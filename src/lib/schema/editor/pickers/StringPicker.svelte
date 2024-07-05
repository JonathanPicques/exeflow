<script lang="ts">
    import {joinId} from '$lib/helper/html';
    import type {JsonSchemaString} from '$lib/schema/schema';

    interface Props {
        id: string;
        value: string;
        schema: JsonSchemaString;
        onchange?: () => void;
    }
    let {id, value = $bindable(), schema, onchange}: Props = $props();
</script>

{#if schema.enum}
    <select bind:value {onchange}>
        {#each schema.enum as enumValue, i}
            <option value={enumValue}>
                {schema.enumLabels?.[i] ?? enumValue}
            </option>
        {/each}
    </select>
{:else if schema.format === 'text'}
    <textarea bind:value rows={3} placeholder={schema.placeholder} onblur={onchange}></textarea>
{:else}
    {@const listId = joinId(id, 'suggestions')}
    {@const suggestions = schema.suggestions || []}

    <input type="text" bind:value list={listId} placeholder={schema.placeholder} onblur={onchange} />
    <datalist id={listId}>
        {#each suggestions as suggestion}
            <option value={suggestion}>{suggestion}</option>
        {/each}
    </datalist>
{/if}

<style>
    input,
    select,
    textarea {
        width: 100%;
        resize: vertical;
    }
</style>
