<script lang="ts">
    import json5 from 'json5';

    import FormEditor from '$lib/core/form/FormEditor.svelte';
    import StringPicker from '$lib/core/form/pickers/StringPicker.svelte';

    import {trySync} from '$lib/core/helper/function';
    import type {PickerProps} from '$lib/core/form/FormEditor.svelte';
    import type {JsonSchemaObject} from '$lib/core/schema/schema';

    let {id, label, value = $bindable(), schema, onchange}: PickerProps<JsonSchemaObject> = $props();

    let text = $state('{}');
    let parsed = $derived(trySync(() => json5.parse(text) as Record<string, unknown>));
    const onblur = () => {
        if (parsed) {
            value = parsed;
            onchange?.();
        }
    };

    $effect(() => {
        text = trySync(() => JSON.stringify(value, null, 2), '');
    });
</script>

{#if schema.properties}
    {#each Object.entries(schema.properties) as [key, subschema] (key)}
        <FormEditor {id} label={subschema.title ?? key} schema={subschema} {onchange} bind:value={value[key]} />
    {/each}
{:else}
    <StringPicker {id} {label} schema={{type: 'string'}} onchange={onblur} bind:value={text} />
{/if}
