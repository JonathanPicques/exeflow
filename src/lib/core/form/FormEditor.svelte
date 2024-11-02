<script lang="ts" module>
    import type {JsonSchema} from '$lib/schema/schema';
    import type {PluginNode} from '$lib/core/core';
    import type {InferJsonSchema} from '$lib/schema/infer';

    export type PickerProps<T extends JsonSchema = JsonSchema, V = InferJsonSchema<T>> = {
        id: PluginNode['id'];
        value: V;
        label?: string;
        schema: T;
        onchange?: () => void;
    };
</script>

<script lang="ts">
    import AnyPicker from '$lib/core/form/pickers/AnyPicker.svelte';
    import ArrayPicker from './pickers/ArrayPicker.svelte';
    import StringPicker from '$lib/core/form/pickers/StringPicker.svelte';
    import NumberPicker from '$lib/core/form/pickers/NumberPicker.svelte';
    import ObjectPicker from '$lib/core/form/pickers/ObjectPicker.svelte';
    import BooleanPicker from '$lib/core/form/pickers/BooleanPicker.svelte';

    let {id, label, value = $bindable(), schema, onchange}: PickerProps = $props();

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

<Picker {id} {label} {schema} {onchange} bind:value />
