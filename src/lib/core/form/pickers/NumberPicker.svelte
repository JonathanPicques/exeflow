<script lang="ts">
    import type {PickerProps} from '$lib/core/form/FormEditor.svelte';
    import type {JsonSchemaNumber} from '$lib/core/schema/schema';

    let {label, value = $bindable(), onchange}: PickerProps<JsonSchemaNumber> = $props();
</script>

<label>
    <span>{label}</span>
    <input type="number" onblur={onchange} bind:value />
</label>

<style>
    label {
        span {
            display: block;
            padding-bottom: 0.5rem;

            color: var(--color-fg-1);
        }
    }

    input {
        width: 100%;
    }
</style>
