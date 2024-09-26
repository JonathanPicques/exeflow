<script lang="ts">
    import FormEditor from '$lib/core/form/FormEditor.svelte';

    import type {PluginNode} from '$lib/core/graph/nodes';
    import type {JsonSchemaObject} from '$lib/schema/schema';

    interface Props {
        id: PluginNode['id'];
        value: Record<string, unknown>;
        schema: JsonSchemaObject;
        onchange?: () => void;
    }
    let {id, value = $bindable(), schema, onchange}: Props = $props();
</script>

{#each Object.entries(schema.properties ?? {}) as [key, subschema] (key)}
    <fieldset>
        <legend title={subschema.description}>{subschema.title ?? key}</legend>
        <FormEditor bind:value={value[key]} {id} schema={subschema} {onchange} />
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
