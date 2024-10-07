<script lang="ts">
    import PluginNodeCard from './PluginNodeCard.svelte';
    import InspectorEditor from './InspectorEditor.svelte';
    import InspectorTrigger from './InspectorTrigger.svelte';

    import {isTriggerNode} from '$lib/core/graph/nodes';
    import {getGraphContext} from '$lib/core/core';
    import {nodeInterpolation, humanPluginName, extractPluginName, extractPluginNamespace} from '$lib/core/parse';
    import type {PluginNode} from '$lib/core/graph/nodes';
    import type {Plugin, PluginId} from '$lib/core/core';

    const {nodes, actions, triggers, findPlugin} = getGraphContext();

    let node = $state<PluginNode>();
    let plugin = $derived(node && findPlugin(node));
    let filter = $state('');

    nodes.subscribe(nodes => {
        node = nodes.find(n => n.selected);
    });

    const sort = ([idA]: [PluginId, Plugin], [idB]: [PluginId, Plugin]) => {
        return extractPluginNamespace(idA).localeCompare(extractPluginNamespace(idB));
    };

    const filterPlugins = ([id, plugin]: [PluginId, Plugin]) => {
        if (filter.includes('type:action') && plugin.type !== 'action') return false;
        if (filter.includes('type:trigger') && plugin.type !== 'trigger') return false;

        const finalFilter = filter
            .replaceAll(/\s*type:action\s*/gm, '')
            .replaceAll(/\s*type:trigger\s*/gm, '')
            .toLocaleLowerCase();

        return (
            id.toLocaleLowerCase().includes(finalFilter) ||
            plugin.description.toLocaleLowerCase().includes(finalFilter) ||
            humanPluginName(extractPluginName(id)).toLocaleLowerCase().includes(finalFilter) ||
            humanPluginName(extractPluginNamespace(id)).toLocaleLowerCase().includes(finalFilter)
        );
    };
</script>

<div class="main">
    {#if node && plugin}
        <h1>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <img
                src={plugin.icon}
                alt=""
                width="32px"
                height="32px"
                onclick={() => {
                    navigator.clipboard.writeText(
                        Object.keys(node!.data.data.results)
                            .map(key => nodeInterpolation(node!.id, key))
                            .join(' '),
                    );
                }}
            />
            <span>{humanPluginName(extractPluginName(node.data.id))}</span>
        </h1>

        <div class="list">
            {#if isTriggerNode(node)}
                <InspectorTrigger {node} />
            {/if}
            <InspectorEditor bind:node />
        </div>
    {:else}
        <input type="search" placeholder="Filter nodes..." bind:value={filter} />

        <div class="list" role="listbox">
            {#each [...Object.entries(triggers), ...Object.entries(actions)].filter(filterPlugins).toSorted(sort) as [id, plugin]}
                <PluginNodeCard {id} {plugin} />
            {/each}
        </div>
    {/if}
</div>

<style>
    h1 {
        gap: 0.5rem;
        display: flex;
        align-items: center;

        & > img {
            height: 2rem;
        }
    }

    .main {
        gap: 1rem;
        flex-grow: 1;
        display: grid;
        padding: 1rem;
        overflow: hidden;
        align-content: start;
    }

    .list {
        gap: 1rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding-right: 0.5rem;
    }
</style>
