<script lang="ts">
    import JsonSchemaEditor from '../JsonSchemaEditor.svelte';
    import type {JsonSchemaObject} from '$lib/schema/schema';

    interface Props {
        value: Record<string, unknown>;
        schema: JsonSchemaObject;
        onchange?: () => void;
    }
    let {value = $bindable(), schema, onchange}: Props = $props();
</script>

{#each Object.entries(schema.properties ?? {}) as [key, subSchema] (key)}
    <fieldset>
        <legend title={subSchema.description}>{subSchema.title ?? key}</legend>
        <JsonSchemaEditor bind:value={value[key]} schema={subSchema} {onchange} />
    </fieldset>
{/each}

<style>
    fieldset {
        border: none;
        padding: 0.5rem 0;
    }

    fieldset legend {
        font-weight: bold;
    }
</style>
