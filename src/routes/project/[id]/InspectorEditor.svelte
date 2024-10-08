<script lang="ts">
    import FormEditor from '$lib/core/form/FormEditor.svelte';

    import {getGraphContext} from '$lib/core/core';
    import type {JsonSchema} from '$lib/schema/schema';
    import type {PluginNode} from '$lib/core/graph/nodes';

    let {node}: {node: PluginNode} = $props();

    let form = $state<{value: unknown; schema: JsonSchema}>();
    const {renderNodeForm, updateNodeData} = getGraphContext();

    $effect(() => {
        renderNodeForm(node.id).then(f => {
            form = f;
        });
    });
</script>

{#if form}
    <FormEditor
        id={node.id}
        schema={form.schema}
        onchange={() => {
            form && updateNodeData(node.id, form.value);
        }}
        bind:value={form.value}
    />
{/if}
