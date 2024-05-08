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
        <button on:click={onEdgeClick}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8.53553" y="0.0502526" width="2" height="12" transform="rotate(45 8.53553 0.0502526)" fill="currentColor" />
                <rect x="0.0502527" y="1.46447" width="2" height="12" transform="rotate(-45 0.0502527 1.46447)" fill="currentColor" />
            </svg>
        </button>
    </div>
</EdgeLabelRenderer>

<style>
    div {
        display: flex;
        position: absolute;
        pointer-events: all;
    }

    button {
        display: flex;
        width: 1.25rem;
        height: 1.25rem;
        align-items: center;
        justify-content: center;

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
