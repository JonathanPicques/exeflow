<script lang="ts">
    import JsonSchemaEditor from '$lib/schema/editor/JsonSchemaEditor.svelte';

    import {zero} from '$lib/schema/validate';
    import {getGraphContext} from '$lib/graph/data';
    import type {PluginNode} from '$lib/graph/nodes';
    import type {JsonSchema} from '$lib/schema/schema';

    const {findPlugin} = getGraphContext();

    let {node}: {node: PluginNode} = $props();
    let plugin = $derived(findPlugin(node.data.id, node.data.type));

    let value = $state<Record<string, unknown>>({});
    let schema = $state<JsonSchema>();
    let dialog: HTMLDialogElement;

    const run = (args: Record<string, unknown>) => {
        //
    };
    const show = () => {
        const {results} = node.data.data;

        if (Object.keys(results).length > 0) {
            schema = {type: 'object', properties: results};
            value = zero(schema) as Record<string, unknown>;
            dialog.showModal();
        } else {
            run({});
        }
    };
</script>

<button onclick={show}>Run</button>
<dialog bind:this={dialog}>
    {#if value && schema}
        <JsonSchemaEditor bind:value {schema} />
        <button onclick={() => run(value)}>Run</button>
        <button onclick={() => dialog.close()}>Cancel</button>
    {/if}
</dialog>
