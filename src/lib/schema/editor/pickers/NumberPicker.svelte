<script lang="ts">
    import {joinId} from '$lib/helper/html';
    import type {JsonSchemaNumber} from '$lib/schema/schema';

    interface Props {
        id: string;
        value: number;
        schema: JsonSchemaNumber;
        onchange?: () => void;
    }
    let {id, value = $bindable(), onchange}: Props = $props();
</script>

<input type="number" bind:value onblur={onchange} />

<style>
    input {
        width: 100%;
    }
</style>
