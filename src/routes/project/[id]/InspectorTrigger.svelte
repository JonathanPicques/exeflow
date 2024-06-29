<script lang="ts">
    import {getGraphContext} from '$lib/core/core';
    import type {TriggerNode} from '$lib/core/graph/nodes';

    let {node}: {node: TriggerNode} = $props();
    const {nodes, edges} = getGraphContext();

    const run = async () => {
        const response = await fetch(`run/${node.id}`, {method: 'POST', body: JSON.stringify({nodes: $nodes, edges: $edges})});
        if (!response.ok) throw new Error();
        if (!response.body) throw new Error();
        const bodyReader = response.body.pipeThrough(new TextDecoderStream()).getReader();

        while (true) {
            const {done, value} = await bodyReader.read();
            if (done) break;
            console.log(
                value
                    .split('\n')
                    .filter(v => v.trim() !== '')
                    .flatMap(v => JSON.parse(v)),
            );
        }
    };

    const open = () => {
        const path = node.data.data.config.value.path;
        window.open(`/api/webhook${path}`);
    };
</script>

<div>
    <button onclick={run}>Run</button>
    {#if node.data.id === 'webhook:webhook' && node.data.data.config.value.method === 'GET'}
        <button onclick={open}>Open in new tab</button>
    {/if}
</div>
