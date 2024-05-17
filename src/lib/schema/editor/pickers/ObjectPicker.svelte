<script lang="ts">
    import JsonSchemaEditor from '../JsonSchemaEditor.svelte';
    import type {JsonSchemaObject} from '$lib/schema/schema';

    interface Props {
        value: Record<string, unknown>;
        schema: JsonSchemaObject;
    }
    let {value = $bindable(), schema}: Props = $props();
</script>

{#each Object.entries(schema.properties ?? {}) as [key, subSchema] (key)}
    <fieldset>
        <legend>{key}</legend>
        <JsonSchemaEditor bind:value={value[key]} schema={subSchema} />
    </fieldset>
{/each}
