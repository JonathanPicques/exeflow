<script lang="ts">
    import {Handle, Position} from '@xyflow/svelte';
    import type {Snippet} from 'svelte';

    interface Props {
        id: string;
        connected: boolean;
        //
        children?: Snippet;
    }

    let {id, children, connected}: Props = $props();
</script>

<div class="handle" class:connected>
    {@render children?.()}
    <Handle {id} type="source" position={Position.Right} />
</div>

<style>
    .handle {
        display: flex;
        flex-grow: 1;
        align-items: center;
        flex-direction: row;
        justify-content: end;

        gap: 0.5rem;

        &.connected {
            --x-color-handle: var(--x-color-plugin);
        }
    }
</style>
