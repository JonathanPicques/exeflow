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
{:else}
    <input type="text" bind:value placeholder={schema.placeholder} />
{/if}

<style>
    input {
        width: 100%;
    }
</style>
