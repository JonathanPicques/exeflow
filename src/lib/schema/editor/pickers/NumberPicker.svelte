<script lang="ts">
    import type {JsonSchemaNumber} from '$lib/schema/schema';

    interface Props {
        value: number;
        schema: JsonSchemaNumber;
    }
    let {value = $bindable()}: Props = $props();
</script>

<input type="number" bind:value />

<style>
    input {
        width: 100%;
    }
</style>
