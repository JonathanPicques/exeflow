<script lang="ts">
    import type {JsonSchemaBoolean} from '$lib/schema/schema';
    import type {PluginNode} from '$lib/core/graph/nodes';

    interface Props {
        id: PluginNode['id'];
        value: boolean;
        schema: JsonSchemaBoolean;
        onchange?: () => void;
    }
    let {value = $bindable(), onchange}: Props = $props();
</script>

<input role="switch" type="checkbox" onblur={onchange} bind:checked={value} />

<style>
    [role='switch'] {
        --toggle-width: 1.4rem;
        --toggle-thumb-gap: 0.2rem;
        --toggle-thumb-size: 0.6rem;

        display: inline-flex;

        cursor: pointer;
        outline: none;
        font-size: 0;
        appearance: none;
        user-select: none;

        margin: 0;
        padding-inline: 0 var(--toggle-width);
        transition: 0.3s all;
        border-radius: 1rem;

        background-color: var(--bg, var(--color-bg-2));
    }
    [role='switch']:checked {
        padding-inline: var(--toggle-width) 0;
        background-color: var(--toggle-active-color, var(--color-primary-1));
    }
    [role='switch']::before {
        content: '';
        margin: var(--toggle-thumb-gap);
        padding: var(--toggle-thumb-size);
        transition: inherit;
        background-color: white;
        box-sizing: border-box;
        border-radius: 1rem;
    }
</style>
