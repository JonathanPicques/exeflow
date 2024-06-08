<script lang="ts">
    import type {JsonSchemaBoolean} from '$lib/schema/schema';

    interface Props {
        value: boolean;
        schema: JsonSchemaBoolean;
        onchange?: () => void;
    }
    let {value = $bindable(), onchange}: Props = $props();
</script>

<input type="checkbox" bind:checked={value} onblur={onchange} />
