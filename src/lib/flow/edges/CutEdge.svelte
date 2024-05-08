<script lang="ts">
    import {useEdges, BaseEdge, getBezierPath, EdgeLabelRenderer} from '@xyflow/svelte';
    import type {EdgeProps} from '@xyflow/svelte';

    type $$Props = EdgeProps;

    export let id: $$Props['id'];
    export let style: $$Props['style'] = undefined;
    export let markerEnd: $$Props['markerEnd'] = undefined;
    export let sourceX: $$Props['sourceX'];
    export let sourceY: $$Props['sourceY'];
    export let sourcePosition: $$Props['sourcePosition'];
    export let targetX: $$Props['targetX'];
    export let targetY: $$Props['targetY'];
    export let targetPosition: $$Props['targetPosition'];

    const edges = useEdges();

    // $: selected = $edges.find(e => e.id === id)?.selected ?? false;
    $: [path, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeClick = () => edges.update(eds => eds.filter(edge => edge.id !== id));
</script>

<BaseEdge {path} {style} {markerEnd} />
<EdgeLabelRenderer>
    <div class="nopan nodrag" style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)">
        <button on:click={onEdgeClick}>×</button>
    </div>
</EdgeLabelRenderer>

<style>
    div {
        display: flex;
        position: absolute;
        pointer-events: all;
    }

    button {
        width: 1.25rem;
        height: 1.25rem;

        color: var(--color-fg);
        border: 0.1rem solid var(--flow-color-edge);
        border-radius: 50%;
        background-color: var(--color-bg);

        cursor: pointer;
        font-size: 0.8rem;

        transition: box-shadow linear 0.1s;

        &:hover {
            box-shadow: 0 0 0.2rem 0.1rem #ddd;
        }

        &:active {
            box-shadow: 0 0 0.3rem 0.1rem #ddd;
        }
    }
</style>
