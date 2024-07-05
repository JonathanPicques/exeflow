<script lang="ts">
    import {joinId} from '$lib/helper/html';
    import type {JsonSchemaBoolean} from '$lib/schema/schema';

    interface Props {
        id: string;
        value: boolean | string;
        schema: JsonSchemaBoolean;
        onchange?: () => void;
    }
    let {id, value = $bindable(), schema, onchange}: Props = $props();

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
    {@const listId = joinId(id, 'suggestions')}
    {@const suggestions = schema.suggestions || []}

    <input type="text" bind:value list={listId} onblur={onchange} oncontextmenu={toggleExpression} />
    <datalist id={listId}>
        {#each suggestions as suggestion}
            <option value={suggestion}>{suggestion}</option>
        {/each}
    </datalist>
{:else}
    <input type="checkbox" bind:checked={value} onblur={onchange} oncontextmenu={toggleExpression} />
{/if}

<style>
    input[type='text'] {
        width: 100%;
    }
</style>
