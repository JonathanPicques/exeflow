<script lang="ts">
    import type {PickerProps} from '$lib/core/form/FormEditor.svelte';

    let {label, value = $bindable(), onchange}: PickerProps = $props();
</script>

{#if typeof value === 'string'}
    <label>
        <span>{label}</span>
        <input type="text" onblur={onchange} bind:value />
    </label>
{/if}

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
