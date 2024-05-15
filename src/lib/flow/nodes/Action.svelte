<script lang="ts">
    import {useEdges} from '@xyflow/svelte';
    import type {NodeProps} from '@xyflow/svelte';

    import InputHandle from '../edges/InputHandle.svelte';
    import OutputHandle from '../edges/OutputHandle.svelte';
    import {getGraphContext} from '$lib/graph/data';
    import {extractPluginName, extractPluginNamespace} from '$lib/helper/extractPluginId';
    import type {ActionNode} from '$lib/graph/nodes';

    type $$Props = NodeProps<ActionNode>;

    export let id: $$Props['id'];
    export let data: $$Props['data'];
    export let selected: $$Props['selected'] = undefined;

    const {actions} = getGraphContext();
    const {icon, color} = actions[data.id]!;

    let edges = useEdges();
    const {title, inputs, outputs} = data.data;
    const nodeTitle = title ?? extractPluginName(data.id);
    const pluginNamespace = extractPluginNamespace(data.id);

    $: connectedInputs = [...new Set($edges.filter(e => e.target === id).map(e => e.targetHandle))] as string[];
    $: connectedOutputs = [...new Set($edges.filter(e => e.source === id).map(e => e.sourceHandle))] as string[];
</script>

<div class="node" style:--x-color-border={selected ? color : 'transparent'} style:--x-color-plugin={color}>
    <div class="inputs">
        {#each inputs as input}
            <InputHandle id={input} connected={connectedInputs.includes(input)}>
                {#if inputs.length > 1}
                    {input}
                {/if}
            </InputHandle>
        {/each}
    </div>
    <div class="content">
        <img src={icon} alt="" />
        <div class="texts">
            <span>{pluginNamespace}</span>
            {#if nodeTitle !== pluginNamespace}
                <span>{nodeTitle}</span>
            {/if}
        </div>
    </div>
    <div class="outputs">
        {#each outputs as output}
            <OutputHandle id={output} connected={connectedOutputs.includes(output)}>
                {#if outputs.length > 1}
                    {output}
                {/if}
            </OutputHandle>
        {/each}
    </div>
</div>

<style>
    .node {
        display: flex;
        padding: 0.5rem;
        min-width: 10rem;

        gap: 1rem;

        border: 0.15rem solid var(--x-color-border, transparent);
        border-radius: var(--flow-border-radius-node);
        background-color: var(--flow-color-node);

        font-family: 'Fira Mono', Monospace;
    }

    .content {
        gap: 1rem;
        display: flex;
        align-items: center;

        & img {
            height: 2rem;
        }
        & .texts {
            gap: 0.2rem;
            display: flex;
            flex-direction: column;

            & span:nth-child(1) {
                color: var(--color-fg);
                font-weight: bold;

                &::first-letter {
                    text-transform: capitalize;
                }
            }
            & span:nth-child(2) {
                color: var(--color-fg-1);
                font-size: 0.6rem;
                font-weight: 200;
            }
        }
    }

    .inputs,
    .outputs {
        display: flex;
        flex-direction: column;
        justify-content: center;

        gap: 0.5rem;
    }
</style>
