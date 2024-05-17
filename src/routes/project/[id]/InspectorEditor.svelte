<script lang="ts">
    import JsonSchemaEditor from '$lib/schema/editor/JsonSchemaEditor.svelte';
    import {getGraphContext} from '$lib/graph/data';
    import type {PluginData} from '$lib/graph/data';
    import type {PluginNode} from '$lib/graph/nodes';
    import type {JsonSchema} from '$lib/schema/schema';

    interface Props {
        node: PluginNode;
    }
    let {node = $bindable()}: Props = $props();
    const {plugin} = getGraphContext();
    const {id, type, data} = $derived(node.data);

    let p = $derived(plugin(id, type));
    let form = $state<JsonSchema | Promise<JsonSchema>>({});
    let config = $state();

    const save = async () => {
        node.data.data = (await p.data({config})) as PluginData;
    };

    $effect(() => {
        form = p.form({config: data.config});
        config = $state.snapshot(data.config);
    });
</script>

{#await form then schema}
    <JsonSchemaEditor bind:value={config} {schema} />
    <button onclick={save}>Save</button>
{/await}
