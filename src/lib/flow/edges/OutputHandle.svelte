<script lang="ts">
    import {Handle, Position} from '@xyflow/svelte';

    export let id: string;
    export let connected: boolean;
</script>

<div class="handle" class:connected>
    <slot />
    <Handle {id} type="source" position={Position.Right} />
</div>

<style>
    .handle {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: end;

        gap: 0.5rem;

        &.connected {
            --color-fill: var(--flow-color-point);
        }
    }
</style>
