<script lang="ts">
    import {zero} from '$lib/core/schema/data';
    import type {PickerProps} from '$lib/core/form/FormEditor.svelte';
    import type {JsonSchemaArray} from '$lib/core/schema/schema';

    let {value = $bindable(), schema, onchange}: PickerProps<JsonSchemaArray> = $props();

    const add = () => {
        if (schema.type === 'array' && schema.items) value.push(zero(schema.items));
    };
    const remove = (i: number) => {
        value.splice(i, 1);
    };

    const up = (i: number) => {
        if (i > 0) {
            [value[i], value[i - 1]] = [value[i - 1], value[i]];
        }
    };
    const down = (i: number) => {
        if (i < value.length - 1) {
            [value[i], value[i + 1]] = [value[i + 1], value[i]];
        }
    };
</script>

<div class="main">
    {#each value as _, i (i)}
        <div class="item">
            <input type="text" onblur={onchange} bind:value={value[i]} />
            <div class="toolbox">
                <button onclick={() => up(i)}>↑</button>
                <button onclick={() => down(i)}>↓</button>
                <button onclick={() => remove(i)}>🗑</button>
            </div>
        </div>
    {/each}
    <button onclick={add}>Add</button>
</div>

<style>
    input {
        width: 100%;
    }

    .main {
        gap: 1rem;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .item {
        gap: 1rem;
        display: flex;
        flex-direction: row;
    }

    .toolbox {
        display: flex;
        flex-direction: row;

        & button:nth-of-type(1) {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        & button:nth-of-type(2) {
            border: none;
            border-left: 0.1rem solid var(--color-bg);
            border-right: 0.1rem solid var(--color-bg);
            border-radius: 0;
        }
        & button:nth-of-type(3) {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
</style>
