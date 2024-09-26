<script lang="ts">
    import FormEditor from '$lib/core/form/FormEditor.svelte';

    import {getGraphContext} from '$lib/core/core';
    import type {JsonSchema} from '$lib/schema/schema';
    import type {PluginNode} from '$lib/core/graph/nodes';

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
    <FormEditor
        bind:value={form.value}
        id={node.id}
        schema={form.schema}
        onchange={() => {
            form && updateNodeData(node.id, form.value);
        }}
    />
{/if}
