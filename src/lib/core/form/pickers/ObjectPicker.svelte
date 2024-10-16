<script lang="ts">
    import FormEditor from '$lib/core/form/FormEditor.svelte';
    import type {PickerProps} from '$lib/core/form/FormEditor.svelte';
    import type {JsonSchemaObject} from '$lib/schema/schema';

    let {id, label, value = $bindable(), schema, onchange}: PickerProps<JsonSchemaObject> = $props();

    const onblur = (e: FocusEvent & {currentTarget: EventTarget & HTMLTextAreaElement}) => {
        try {
            value = JSON.parse(e.currentTarget.value);
            onchange?.();
        } catch (_) {
            //
        }
    };
</script>

{#if schema.properties}
    {#each Object.entries(schema.properties) as [key, subschema] (key)}
        <FormEditor {id} label={subschema.title ?? key} schema={subschema} {onchange} bind:value={value[key]} />
    {/each}
{:else if typeof schema.additionalProperties === 'object'}
    {@const keys = Object.keys(value)}

    <label>
        <span>{label}</span>
        <textarea {onblur}>{JSON.stringify(value, null, 2)}</textarea>
    </label>

    <div>
        {#each keys as key (key)}
            <FormEditor {id} label={key} schema={schema.additionalProperties} {onchange} bind:value={value[key]} />
        {/each}
    </div>
{/if}

<style>
    div {
        gap: 1rem;
        display: flex;
        border-left: 0.2rem solid var(--color-bg-2);
        padding-left: 1rem;
        flex-direction: column;
    }

    label {
        span {
            display: block;
            padding-bottom: 0.5rem;

            color: var(--color-fg-1);
        }
    }

    textarea {
        width: 100%;
        height: 10rem;
        resize: vertical;
    }
</style>
