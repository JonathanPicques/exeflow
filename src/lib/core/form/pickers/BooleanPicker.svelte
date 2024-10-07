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
