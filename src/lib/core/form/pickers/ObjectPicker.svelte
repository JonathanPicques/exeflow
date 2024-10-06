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
    {#if subschema.editor?.label === 'hide'}
        <FormEditor {id} schema={subschema} {onchange} bind:value={value[key]} />
    {:else}
        <fieldset>
            <legend title={subschema.description}>{subschema.title ?? key}</legend>
            <FormEditor {id} schema={subschema} {onchange} bind:value={value[key]} />
        </fieldset>
    {/if}
{/each}

<style>
    fieldset {
        border: none;
        padding-top: 0.5rem;
    }

    fieldset legend {
        font-weight: bold;
    }
</style>
