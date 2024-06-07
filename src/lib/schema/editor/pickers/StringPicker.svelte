<script lang="ts">
    import type {JsonSchemaString} from '$lib/schema/schema';

    interface Props {
        value: string;
        schema: JsonSchemaString;
    }
    let {value = $bindable(), schema}: Props = $props();
</script>

{#if schema.enum}
    <select bind:value>
        {#each schema.enum as enumValue, i}
            <option value={enumValue}>
                {schema.enumLabels?.[i] ?? enumValue}
            </option>
        {/each}
    </select>
{:else if schema.format === undefined}
    <input type="text" bind:value placeholder={schema.placeholder} />
{:else if schema.format === 'text'}
    <textarea bind:value rows="3" placeholder={schema.placeholder}></textarea>
{/if}

<style>
    input,
    select,
    textarea {
        width: 100%;
        resize: vertical;
    }
</style>
