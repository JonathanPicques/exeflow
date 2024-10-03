<script lang="ts">
    import {Handle, Position} from '@xyflow/svelte';
    import type {Snippet} from 'svelte';

    interface Props {
        id: string;
        connected: boolean;
    }
    let {id, connected}: Props = $props();
</script>

<div title={id} class="handle" class:connected>
    <Handle {id} type="target" position={Position.Left} />
</div>

<style>
    .handle {
        gap: 0.5rem;
        display: flex;
        flex-grow: 1;
        align-items: center;
        flex-direction: row;
        justify-content: start;

        &.connected {
            --x-color-handle: var(--x-color-plugin);
        }
    }
</style>
