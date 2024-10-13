<script lang="ts">
    import PluginNodeCard from './PluginNodeCard.svelte';
    import InspectorEditor from './InspectorEditor.svelte';
    import InspectorTrigger from './InspectorTrigger.svelte';

    import {isTriggerNode} from '$lib/core/graph/nodes';
    import {getGraphContext} from '$lib/core/core';
    import {humanPluginName, extractPluginName, extractPluginNamespace} from '$lib/core/parse';
    import type {PluginNode} from '$lib/core/graph/nodes';
    import type {Plugin, PluginId} from '$lib/core/core';

    const {nodes, actions, triggers, getPlugin} = getGraphContext();

    let node = $state<PluginNode>();
    let plugin = $derived(node && getPlugin(node));
    let filter = $state('');

    nodes.subscribe(nodes => {
        node = nodes.find(n => n.selected);
    });

    const sort = ([a]: [PluginId, Plugin], [b]: [PluginId, Plugin]) => {
        const nameA = extractPluginName(a);
        const nameB = extractPluginName(b);
        const namespaceA = extractPluginNamespace(a);
        const namespaceB = extractPluginNamespace(b);

        const compare = namespaceA.localeCompare(namespaceB);
        if (compare === 0) return nameA.length - nameB.length;
        if (namespaceA === 'cron') return -1;
        if (namespaceB === 'cron') return 1;
        if (namespaceA === 'http') return -1;
        if (namespaceB === 'http') return 1;
        if (namespaceA === 'webhook') return -1;
        if (namespaceB === 'webhook') return 1;
        return compare;
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
            <img src={plugin.icon} alt="" width="32px" height="32px" />
            <span>{humanPluginName(extractPluginName(node.data.id))}</span>
        </h1>

        <div class="list">
            {#if isTriggerNode(node)}
                <InspectorTrigger {node} />
            {/if}
            <InspectorEditor {node} />
        </div>
    {:else}
        <input type="search" placeholder="Filter nodes..." bind:value={filter} />

        <div class="list" role="list">
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
