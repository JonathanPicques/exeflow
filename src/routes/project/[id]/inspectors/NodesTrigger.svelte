<script lang="ts">
    import {page} from '$app/stores';
    import {getGraphContext} from '$lib/core/core';
    import type {TriggerNode} from '$lib/core/core';

    let {node}: {node: TriggerNode} = $props();
    const {nodes, edges} = getGraphContext();

    const copy = () => {
        const {port, hostname, protocol} = new URL(location.href);

        window.navigator.clipboard.writeText(`${protocol}//${hostname}:${port}/api/project/${$page.params.id}/triggers/run/${node.id}`);
    };
    const open = () => {
        window.open(`/api/project/${$page.params.id}/triggers/webhook${node.data.data.config.value.path}`);
    };
    const test = async () => {
        const response = await fetch(`/api/project/${$page.params.id}/triggers/test/${node.id}`, {method: 'POST', body: JSON.stringify({nodes: $nodes, edges: $edges})});

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
</script>

<div>
    <button onclick={test}>Test</button>
    {#if node.data.id === 'webhook:webhook' && node.data.data.config.value.method === 'GET'}
        <button onclick={open}>Open in new tab</button>
    {/if}
    <button onclick={copy}>Copy trigger URL</button>
</div>

<style>
    div {
        gap: 0.5rem;
        display: flex;
    }
</style>
