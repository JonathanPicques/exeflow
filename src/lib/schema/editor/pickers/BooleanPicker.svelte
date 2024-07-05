<script lang="ts">
    import type {JsonSchemaBoolean} from '$lib/schema/schema';

    interface Props {
        id: string;
        value: boolean | string;
        schema: JsonSchemaBoolean;
        onchange?: () => void;
    }
    let {value = $bindable(), onchange}: Props = $props();

    const toggleExpression = (e: Event) => {
        e.preventDefault();
        switch (typeof value) {
            case 'string':
                if (value === 'true') value = true;
                if (value === 'false') value = false;
                else value = new Boolean(value).valueOf();
                break;
            case 'boolean':
                value = value.toString();
                break;
            default:
                throw new Error(`value can either be a boolean or a string, got ${typeof value}`);
        }
    };
</script>

{#if typeof value === 'string'}
    <input type="text" bind:value onblur={onchange} oncontextmenu={toggleExpression} />
{:else}
    <input type="checkbox" bind:checked={value} onblur={onchange} oncontextmenu={toggleExpression} />
{/if}

<style>
    input[type='text'] {
        width: 100%;
    }
</style>
