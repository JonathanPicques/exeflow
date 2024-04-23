<script lang="ts">
    import {useRows} from '../rows';
    import {type ActionNode} from '$lib/graph/nodes';
    import {type Point, makeHandleId} from '$lib/graph/points';
    import {Handle, useEdges, Position, type NodeProps} from '@xyflow/svelte';

    type $$Props = NodeProps<ActionNode>;

    export let id: $$Props['id'];
    export let data: $$Props['data'];

    const rows = useRows(data);
    const edges = useEdges();

    $: lefts = [...new Set($edges.filter(e => e.target === id).map(e => e.targetHandle))] as string[];
    $: rights = [...new Set($edges.filter(e => e.source === id).map(e => e.sourceHandle))] as string[];
    $: leftHandleStyle = (left: Point) => {
        const selected = lefts.includes(makeHandleId(left));
        return `
            position: relative;
            top: 8px;
            width: 5px;
            height: 5px;
            border: 1px solid var(--point-color);
            border-radius: ${left.type === 'input' ? '0' : '100%'};
            background-color: ${selected ? 'var(--point-color)' : 'transparent'};
        `;
    };
    $: rightHandleStyle = (right: Point) => {
        const selected = rights.includes(makeHandleId(right));
        return `
            position: relative;
            top: 8px;
            width: 5px;
            height: 5px;
            border: 1px solid var(--point-color);
            border-radius: ${right.type === 'output' ? '0' : '100%'};
            background-color: ${selected ? 'var(--point-color)' : 'transparent'};
        `;
    };
</script>

<div class="head">
    <img src={data.icon} alt="webhook" />
    <span>{data.name}</span>
</div>

{#each rows as [left, right]}
    <div class="row">
        {#if left}
            <div class={left.type}>
                <Handle id={makeHandleId(left)} type="target" style={leftHandleStyle(left)} position={Position.Left} />
                <span>{left.id}</span>
            </div>
        {/if}
        {#if right}
            <div class={right.type}>
                <span>{right.id}</span>
                <Handle id={makeHandleId(right)} type="source" style={rightHandleStyle(right)} position={Position.Right} />
            </div>
        {/if}
    </div>
{/each}

<style>
    :global(.svelte-flow__node-action) {
        --node-color: #f3ce39;
        --point-color: #ccc;

        display: flex;
        padding: 10px;
        min-width: 150px;
        flex-direction: column;

        color: var(--text-color);
        border: 2px solid transparent;
        border-radius: 5px;
        background-color: var(--node-bg-color);

        text-align: center;
        font-family: 'Fira Mono', Monospace;
        font-weight: 500;
        letter-spacing: -0.2px;
    }

    :global(.svelte-flow__node-action.selected) {
        border: 2px solid var(--node-color);
    }

    .head {
        display: flex;
        flex-direction: row;

        gap: 10px;
    }

    .head > span {
        color: var(--node-color);
        font-size: 16px;
        font-weight: bold;
    }

    .row {
        display: flex;
        flex-direction: row;
        padding-top: 5px;
    }

    .input,
    .param {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
    }

    .input > span,
    .param > span {
        flex-grow: 1;

        color: var(--point-color);
        font-size: 12px;
        text-align: start;
    }

    .output,
    .return {
        display: flex;
        flex-grow: 1;
        flex-direction: row;
    }

    .output > span,
    .return > span {
        flex-grow: 1;

        color: var(--point-color);
        font-size: 12px;
        text-align: end;
    }
</style>
