<script lang="ts" context="module">
    import type {ActionNodeData} from '$lib/graph/nodes';

    export const splitActionHandles = (nodeData: ActionNodeData) => {
        const hasIn = nodeData.inputs.find(i => i === 'in') !== undefined;
        const hasOut = nodeData.outputs.find(o => o === 'out') !== undefined;
        const handleRows: {input: string | undefined; output: string | undefined}[] = [];
        const inputsWithoutIn = nodeData.inputs.filter(i => i !== 'in');
        const outputsWithoutOut = nodeData.outputs.filter(o => o !== 'out');

        for (let i = 0; i < Math.max(inputsWithoutIn.length, outputsWithoutOut.length); i += 1) {
            handleRows.push({input: inputsWithoutIn[i], output: outputsWithoutOut[i]});
        }

        return {
            hasIn,
            hasOut,
            handleRows,
            inputsWithoutIn,
            outputsWithoutOut,
        };
    };
</script>

<script lang="ts">
    import {useEdges} from '@xyflow/svelte';
    import type {NodeProps} from '@xyflow/svelte';

    import InputHandle from '../edges/InputHandle.svelte';
    import OutputHandle from '../edges/OutputHandle.svelte';
    import type {ActionNode} from '$lib/graph/nodes';

    type $$Props = NodeProps<ActionNode>;

    export let id: $$Props['id'];
    export let data: $$Props['data'];

    let name = data.name;
    let icon = data.icon;
    let edges = useEdges();
    let handles = splitActionHandles(data);
    $: connectedInputs = [...new Set($edges.filter(e => e.target === id).map(e => e.targetHandle))] as string[];
    $: connectedOutputs = [...new Set($edges.filter(e => e.source === id).map(e => e.sourceHandle))] as string[];
</script>

<div class="head">
    {#if handles.hasIn}<InputHandle id="in" connected={connectedInputs.includes('in')} />{/if}
    <div class="title">
        <img src={icon} alt="webhook" />
        <span>{name}</span>
    </div>
    {#if handles.hasOut}<OutputHandle id="out" connected={connectedOutputs.includes('out')} />{/if}
</div>

{#if handles.handleRows.length > 0}
    <div class="handles">
        {#each handles.handleRows as { input, output }}
            <div class="row">
                <div class="input">
                    {#if input}<InputHandle id={input} connected={connectedInputs.includes(input)}>{input}</InputHandle>{/if}
                </div>
                <div class="output">
                    {#if output}<OutputHandle id={output} connected={connectedOutputs.includes(output)}>{output}</OutputHandle>{/if}
                </div>
            </div>
        {/each}
    </div>
{/if}

<style>
    :global(.svelte-flow__node-action) {
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

    :global(.svelte-flow__node-action.selected) {
        border: 2px solid var(--color-action);
    }

    .head {
        display: flex;
        flex-grow: 1;
        flex-direction: row;

        gap: 0.5rem;

        & .title {
            display: flex;
            flex-grow: 1;
            justify-content: center;

            gap: 0.5rem;
            color: var(--color-action);
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

            & .input {
                flex-grow: 1;
            }
            & .output {
                flex-grow: 1;
            }
        }
    }
</style>
