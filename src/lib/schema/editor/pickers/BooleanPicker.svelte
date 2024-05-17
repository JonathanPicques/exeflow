<script lang="ts">
    import type {JsonSchemaBoolean} from '$lib/schema/schema';

    interface Props {
        value: boolean;
        schema: JsonSchemaBoolean;
    }
    let {value = $bindable()}: Props = $props();
</script>

<input type="checkbox" bind:checked={value} />
