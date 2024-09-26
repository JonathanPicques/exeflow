<script lang="ts">
    import AnyPicker from '$lib/schema/editor/pickers/AnyPicker.svelte';
    import ArrayPicker from './pickers/ArrayPicker.svelte';
    import StringPicker from '$lib/schema/editor/pickers/StringPicker.svelte';
    import NumberPicker from '$lib/schema/editor/pickers/NumberPicker.svelte';
    import ObjectPicker from '$lib/schema/editor/pickers/ObjectPicker.svelte';
    import BooleanPicker from '$lib/schema/editor/pickers/BooleanPicker.svelte';
    import type {JsonSchema} from '$lib/schema/schema';
    import type {PluginNode} from '$lib/core/graph/nodes';

    interface Props {
        id: PluginNode['id'];
        value: unknown;
        schema: JsonSchema;
        onchange?: () => void;
    }

    let {id, value = $bindable(), schema, onchange}: Props = $props();

    const Picker = $derived.by(() => {
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

<Picker bind:value {id} {schema} {onchange} />
