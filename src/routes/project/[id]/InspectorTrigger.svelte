<script lang="ts">
    import type {TriggerNode} from '$lib/core/graph/nodes';

    let {node}: {node: TriggerNode} = $props();

    let dialog: HTMLDialogElement;

    const run = () => {};
    const show = () => {
        run();
        dialog.showModal();
    };
</script>

<button onclick={show}>Run</button>
<dialog bind:this={dialog}>
    <button onclick={() => dialog.close()}>Close</button>
</dialog>
