<script lang="ts">
    import type {PluginNode} from '$lib/graph/nodes';

    let {node}: {node: PluginNode} = $props();

    const run = () => {
        console.log(node.id);
    };
</script>

<button onclick={run}>Run</button>
