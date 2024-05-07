<script lang="ts">
    import {Handle, Position} from '@xyflow/svelte';

    export let id: string;
    export let connected: boolean;
</script>

<div class="handle" class:connected>
    <Handle {id} type="target" class="test" position={Position.Left} />
    <slot />
</div>

<style>
    .handle {
        display: flex;
        align-items: center;
        flex-direction: row;

        gap: 0.5rem;

        &.connected {
            --color-fill: var(--flow-color-point);
        }
    }
</style>
