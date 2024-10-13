<script lang="ts">
    import {BaseEdge, getSmoothStepPath, EdgeLabelRenderer} from '@xyflow/svelte';
    import type {EdgeProps} from '@xyflow/svelte';

    import {getGraphContext} from '$lib/core/core';

    let {id, style, markerEnd, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition}: EdgeProps = $props();
    const {edges} = getGraphContext();
    const [path, labelX, labelY] = $derived(getSmoothStepPath({sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 10}));

    const onEdgeClick = () => edges.update(eds => eds.filter(edge => edge.id !== id));
</script>

<BaseEdge {path} {style} {markerEnd} />
<EdgeLabelRenderer>
    <div class="nopan nodrag" style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)">
        <button class="custom" onclick={onEdgeClick} aria-label="cut connection">
            <svg width="18" height="18" viewBox="0 0 18 18">
                <circle cx="9" cy="9" r="7" fill="#2d2d2d" stroke="#aaaaaa" stroke-width="2" />
                <rect x="5.96942" y="7.18176" width="1.71429" height="6.85714" rx="0.857143" transform="rotate(-45 5.96942 7.18176)" fill="#aaaaaa" />
                <rect x="7.1817" y="12.0304" width="1.71429" height="6.85714" rx="0.857143" transform="rotate(-135 7.1817 12.0304)" fill="#aaaaaa" />
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
        justify-content: center;

        color: var(--color-fg);
        cursor: pointer;
        background-color: transparent;

        transition: transform 0.15s ease;

        &:hover {
            transform: scale(1.1);
        }
        &:active {
            transform: scale(0.95);
        }
    }
</style>
