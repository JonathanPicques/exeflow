<script lang="ts">
    import type {JsonSchemaString} from '$lib/schema/schema';

    interface Props {
        value: string;
        schema: JsonSchemaString;
        onchange?: () => void;
    }
    let {value = $bindable(), schema, onchange}: Props = $props();
</script>

{#if schema.enum}
    <select bind:value {onchange}>
        {#each schema.enum as enumValue, i}
            <option value={enumValue}>
                {schema.enumLabels?.[i] ?? enumValue}
            </option>
        {/each}
    </select>
{:else if schema.format === undefined}
    <input type="text" bind:value placeholder={schema.placeholder} onblur={onchange} />
{:else if schema.format === 'text'}
    <textarea rows={3} bind:value placeholder={schema.placeholder} onblur={onchange}></textarea>
{/if}

<style>
    input,
    select,
    textarea {
        width: 100%;
        resize: vertical;
    }
</style>
