<script lang="ts">
    import type {JsonSchema} from '$lib/schema/schema';

    interface Props {
        value: unknown;
        schema: JsonSchema;
    }
    let {value = $bindable(), schema}: Props = $props();
</script>

<input type="text" bind:value />
