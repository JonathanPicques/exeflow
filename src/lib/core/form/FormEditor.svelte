<script lang="ts">
    import AnyPicker from '$lib/core/form/pickers/AnyPicker.svelte';
    import ArrayPicker from './pickers/ArrayPicker.svelte';
    import StringPicker from '$lib/core/form/pickers/StringPicker.svelte';
    import NumberPicker from '$lib/core/form/pickers/NumberPicker.svelte';
    import ObjectPicker from '$lib/core/form/pickers/ObjectPicker.svelte';
    import BooleanPicker from '$lib/core/form/pickers/BooleanPicker.svelte';

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

<Picker {id} {schema} {onchange} bind:value />
