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
    <Handle {id} type="target" position={Position.Left} />
    {@render children?.()}
</div>

<style>
    .handle {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: start;

        gap: 0.5rem;

        &.connected {
            --color-fill: var(--x-flow-color-plugin);
        }
    }
</style>
