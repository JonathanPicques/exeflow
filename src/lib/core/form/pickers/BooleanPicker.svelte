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

<input type="checkbox" onblur={onchange} bind:checked={value} />
