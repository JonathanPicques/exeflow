<script lang="ts">
    import type {JsonSchemaNumber} from '$lib/schema/schema';

    interface Props {
        id: string;
        value: number | string;
        schema: JsonSchemaNumber;
        onchange?: () => void;
    }
    let {value = $bindable(), onchange}: Props = $props();

    const toggleExpression = (e: Event) => {
        e.preventDefault();
        switch (typeof value) {
            case 'number':
                value = value.toString();
                break;
            case 'string':
                value = parseFloat(value);
                break;
            default:
                throw new Error(`value can either be a number or a string, got ${typeof value}`);
        }
    };
</script>

{#if typeof value === 'string'}
    <input type="text" bind:value onblur={onchange} oncontextmenu={toggleExpression} />
{:else}
    <input type="number" bind:value onblur={onchange} oncontextmenu={toggleExpression} />
{/if}

<style>
    input {
        width: 100%;
    }
</style>
