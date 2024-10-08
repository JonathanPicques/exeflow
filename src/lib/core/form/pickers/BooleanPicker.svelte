<script lang="ts">
    import type {PickerProps} from '../FormEditor.svelte';
    import type {JsonSchemaBoolean} from '$lib/schema/schema';

    let {label, value = $bindable(), onchange}: PickerProps<JsonSchemaBoolean> = $props();
</script>

<label>
    <span>{label}</span>
    <input role="switch" type="checkbox" onblur={onchange} bind:checked={value} />
</label>

<style>
    label {
        span {
            display: block;
            padding-bottom: 0.5rem;

            color: var(--color-fg-1);
        }
    }

    [role='switch'] {
        --toggle-width: 1.4rem;
        --toggle-thumb-gap: 0.2rem;
        --toggle-thumb-size: 0.6rem;

        cursor: pointer;
        margin: 0;
        display: inline-flex;
        outline: none;
        font-size: 0;
        appearance: none;
        user-select: none;
        border-radius: 1rem;
        padding-inline: 0 var(--toggle-width);
        background-color: var(--bg, var(--color-bg-2));

        transition: 0.3s;

        &:checked {
            padding-inline: var(--toggle-width) 0;
            background-color: var(--toggle-active-color, var(--color-primary-1));
        }

        &::before {
            margin: var(--toggle-thumb-gap);
            content: '';
            padding: var(--toggle-thumb-size);
            box-sizing: border-box;
            transition: inherit;
            border-radius: 1rem;
            background-color: white;
        }
    }
</style>
