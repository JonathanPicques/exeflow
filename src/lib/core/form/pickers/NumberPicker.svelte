<script lang="ts">
    import type {JsonSchemaNumber} from '$lib/schema/schema';
    import type {PluginNode} from '$lib/core/graph/nodes';

    interface Props {
        id: PluginNode['id'];
        value: number;
        schema: JsonSchemaNumber;
        onchange?: () => void;
    }
    let {id, value = $bindable(), onchange}: Props = $props();
</script>

<input type="number" onblur={onchange} bind:value />

<style>
    input {
        width: 100%;
    }
</style>
