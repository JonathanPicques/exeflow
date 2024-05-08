<script lang="ts" context="module">
    import type {TriggerNodeData} from '$lib/graph/nodes';

    export const splitTriggerHandles = ({data}: TriggerNodeData) => {
        const hasOut = data.outputs.find(o => o === 'out') !== undefined;
        const outputsWithoutOut = data.outputs.filter(o => o !== 'out');

        return {
            hasOut,
            outputsWithoutOut,
        };
    };
</script>

<script lang="ts">
    import {useEdges} from '@xyflow/svelte';
    import type {NodeProps} from '@xyflow/svelte';

    import OutputHandle from '../edges/OutputHandle.svelte';
    import type {TriggerNode} from '$lib/graph/nodes';

    type $$Props = NodeProps<TriggerNode>;

    export let id: $$Props['id'];
    export let data: $$Props['data'];

    let name = data.name;
    let icon = data.icon;
    let edges = useEdges();
    let handles = splitTriggerHandles(data);
    $: connectedOutputs = [...new Set($edges.filter(e => e.source === id).map(e => e.sourceHandle))] as string[];
</script>

<div class="head">
    <div class="title">
        <img src={icon} alt="webhook" />
        <span>{name}</span>
    </div>
    {#if handles.hasOut}<OutputHandle id="out" connected={connectedOutputs.includes('out')} />{/if}
</div>

{#if handles.outputsWithoutOut.length > 0}
    <div class="handles">
        {#each handles.outputsWithoutOut as output}
            <div class="row">
                <div class="output">
                    {#if output}<OutputHandle id={output} connected={connectedOutputs.includes(output)}>{output}</OutputHandle>{/if}
                </div>
            </div>
        {/each}
    </div>
{/if}

<style>
    :global(.svelte-flow__node-trigger) {
        display: flex;
        padding: 0.5rem;
        min-width: 10rem;
        flex-direction: column;

        color: var(--color-fg);
        border: 2px solid transparent;
        border-radius: 5px;
        background-color: var(--flow-color-node-bg);

        text-align: center;
        font-family: 'Fira Mono', Monospace;
        font-weight: 500;
        letter-spacing: -0.2px;
    }

    :global(.svelte-flow__node-trigger.selected) {
        border: 2px solid var(--color-trigger);
    }

    .head {
        display: flex;
        flex-grow: 1;
        flex-direction: row;

        gap: 0.6rem;

        & .title {
            display: flex;
            flex-grow: 1;
            justify-content: center;

            gap: 0.5rem;
            color: var(--color-trigger);
            font-size: 1rem;
            font-weight: bold;
        }
    }

    .handles {
        display: flex;
        flex-grow: 1;
        padding-top: 5px;
        flex-direction: column;

        & .row {
            display: flex;
            flex-grow: 1;
            flex-direction: row;

            gap: 1rem;

            & .output {
                flex-grow: 1;
            }
        }
    }
</style>
