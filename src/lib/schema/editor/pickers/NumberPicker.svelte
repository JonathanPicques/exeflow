<script lang="ts">
    import type {JsonSchemaNumber} from '$lib/schema/schema';

    interface Props {
        id: string;
        value: number;
        schema: JsonSchemaNumber;
        onchange?: () => void;
    }
    let {value = $bindable(), onchange}: Props = $props();
</script>

<input type="number" bind:value onblur={onchange} />

<style>
    input {
        width: 100%;
    }
</style>
