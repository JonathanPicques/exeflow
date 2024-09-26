<script lang="ts">
    import type {JsonSchema} from '$lib/schema/schema';
    import type {PluginNode} from '$lib/core/graph/nodes';

    interface Props {
        id: PluginNode['id'];
        value: unknown;
        schema: JsonSchema;
        onchange?: () => void;
    }
    let {value = $bindable(), onchange}: Props = $props();
</script>

<input type="text" onblur={onchange} bind:value />

<style>
    input {
        width: 100%;
    }
</style>
