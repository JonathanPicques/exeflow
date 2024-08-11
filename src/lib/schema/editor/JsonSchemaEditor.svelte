<script lang="ts">
    import AnyPicker from '$lib/schema/editor/pickers/AnyPicker.svelte';
    import ArrayPicker from './pickers/ArrayPicker.svelte';
    import StringPicker from '$lib/schema/editor/pickers/StringPicker.svelte';
    import NumberPicker from '$lib/schema/editor/pickers/NumberPicker.svelte';
    import ObjectPicker from '$lib/schema/editor/pickers/ObjectPicker.svelte';
    import BooleanPicker from '$lib/schema/editor/pickers/BooleanPicker.svelte';
    import type {JsonSchema} from '$lib/schema/schema';

    interface Props {
        id: string;
        value: unknown;
        schema: JsonSchema;
        onchange?: () => void;
    }

    let {id, value = $bindable(), schema, onchange}: Props = $props();
    const picker = $derived.by(() => {
        switch (schema.type) {
            case 'array':
                return ArrayPicker;
            case 'string':
                return StringPicker;
            case 'number':
                return NumberPicker;
            case 'object':
                return ObjectPicker;
            case 'boolean':
                return BooleanPicker;
            default:
                return AnyPicker;
        }
    }) as typeof AnyPicker;
</script>

<svelte:component this={picker} bind:value {id} {schema} {onchange} />
