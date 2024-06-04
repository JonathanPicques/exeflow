<script lang="ts">
    import type {JsonSchema} from '$lib/schema/schema';

    interface Props {
        value: unknown;
        schema: JsonSchema;
    }
    let {value = $bindable()}: Props = $props();
</script>

<input type="text" bind:value />

<style>
    input {
        width: 100%;
    }
</style>
