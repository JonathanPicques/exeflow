<script lang="ts">
    import {Handle, Position} from '@xyflow/svelte';

    export let id: string;
    export let connected: boolean;
</script>

<div class="handle" style:--color-fill="{connected ? 'var(--flow-color-point)' : 'transparent'} ">
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

        & :global(.svelte-flow__handle) {
            border-color: var(--flow-color-point);
            background-color: var(--color-fill);

            &:global(.connectingto),
            &:global(.connectingfrom) {
                background-color: var(--flow-color-point);
            }
        }
    }
</style>
