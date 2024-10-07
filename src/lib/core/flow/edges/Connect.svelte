<script lang="ts">
    import {BaseEdge, getSmoothStepPath, useConnection} from '@xyflow/svelte';

    const connection = useConnection();

    const sourceX = $derived($connection.to?.x ?? 0);
    const sourceY = $derived($connection.to?.y ?? 0);
    const sourcePosition = $derived($connection.toPosition!);

    const targetX = $derived($connection.from?.x ?? 0);
    const targetY = $derived($connection.from?.y ?? 0);
    const targetPosition = $derived($connection.fromPosition!);

    const [path] = $derived(getSmoothStepPath({sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 10}));
</script>

<BaseEdge {path} />
