<script lang="ts">
    import {joinId} from '$lib/helper/html';
    import JsonSchemaEditor from '$lib/schema/editor/JsonSchemaEditor.svelte';
    import type {JsonSchemaObject} from '$lib/schema/schema';

    interface Props {
        id: string;
        value: Record<string, unknown>;
        schema: JsonSchemaObject;
        onchange?: () => void;
    }
    let {id, value = $bindable(), schema, onchange}: Props = $props();
</script>

{#each Object.entries(schema.properties ?? {}) as [key, subSchema] (key)}
    <fieldset>
        <legend title={subSchema.description}>{subSchema.title ?? key}</legend>
        <JsonSchemaEditor bind:value={value[key]} id={joinId(id, key)} schema={subSchema} {onchange} />
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
