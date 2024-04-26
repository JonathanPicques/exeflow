<script lang="ts">
    import {useEdges, BaseEdge, getBezierPath, EdgeLabelRenderer, type EdgeProps} from '@xyflow/svelte';

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
        width: 20px;
        height: 20px;

        color: var(--text-color);
        border: 1px solid #fff;
        border-radius: 50%;
        background-color: var(--bg-color);

        cursor: pointer;
        font-size: 12px;
        line-height: 1;
        text-align: center;

        transition: box-shadow linear 0.1s;
    }

    button:hover {
        box-shadow: 0 0 4px 2px rgba(252, 252, 252, 0.998);
    }

    button:active {
        box-shadow: 0 0 6px 2px rgba(252, 252, 252, 0.998);
    }
</style>
