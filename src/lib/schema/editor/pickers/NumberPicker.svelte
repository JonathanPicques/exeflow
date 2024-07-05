<script lang="ts">
    import {joinId} from '$lib/helper/html';
    import type {JsonSchemaNumber} from '$lib/schema/schema';

    interface Props {
        id: string;
        value: number | string;
        schema: JsonSchemaNumber;
        onchange?: () => void;
    }
    let {id, value = $bindable(), schema, onchange}: Props = $props();

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
    {@const listId = joinId(id, 'suggestions')}
    {@const suggestions = schema.suggestions || []}

    <input type="text" bind:value list={listId} onblur={onchange} oncontextmenu={toggleExpression} />
    <datalist id={listId}>
        {#each suggestions as suggestion}
            <option value={suggestion}>{suggestion}</option>
        {/each}
    </datalist>
{:else}
    <input type="number" bind:value onblur={onchange} oncontextmenu={toggleExpression} />
{/if}

<style>
    input {
        width: 100%;
    }
</style>
