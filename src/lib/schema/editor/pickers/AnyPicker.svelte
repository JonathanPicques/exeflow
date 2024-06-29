<script lang="ts">
    import type {JsonSchema} from '$lib/schema/schema';

    interface Props {
        id: string;
        value: unknown;
        schema: JsonSchema;
        onchange?: () => void;
    }
    let {value = $bindable(), onchange}: Props = $props();
</script>

<input type="text" bind:value onblur={onchange} />

<style>
    input {
        width: 100%;
    }
</style>
