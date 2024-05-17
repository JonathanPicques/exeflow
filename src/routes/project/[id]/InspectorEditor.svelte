<script lang="ts">
    import JsonSchemaEditor from '$lib/schema/editor/JsonSchemaEditor.svelte';
    import {getGraphContext} from '$lib/graph/data';
    import type {PluginNode} from '$lib/graph/nodes';
    import type {JsonSchema} from '$lib/schema/schema';

    let form = $state<{value: unknown; schema: JsonSchema}>();
    let {node = $bindable()}: {node: PluginNode} = $props();
    const {getNodeForm, updateNodeData} = getGraphContext();

    $effect(() => {
        (async () => {
            form = await getNodeForm(node.id);
        })();
    });
</script>

{#if form}
    <JsonSchemaEditor bind:value={form.value} schema={form.schema} />
    <button
        onclick={() => {
            form && updateNodeData(node.id, form.value);
        }}
    >
        <span>Save</span>
    </button>
{/if}
