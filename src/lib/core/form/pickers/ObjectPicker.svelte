<script lang="ts">
    import FormEditor from '$lib/core/form/FormEditor.svelte';
    import type {PickerProps} from '$lib/core/form/FormEditor.svelte';
    import type {JsonSchemaObject} from '$lib/schema/schema';

    let {id, value = $bindable(), schema, onchange}: PickerProps<JsonSchemaObject> = $props();
</script>

{#each Object.entries(schema.properties ?? {}) as [key, subschema] (key)}
    <FormEditor {id} label={subschema.title ?? key} schema={subschema} {onchange} bind:value={value[key]} />
{/each}
