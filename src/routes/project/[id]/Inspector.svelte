<script lang="ts">
    import InspectorEditor from './InspectorEditor.svelte';
    import {getGraphContext} from '$lib/graph/data';
    import {humanPluginName, extractPluginName, extractPluginNamespace} from '$lib/helper/plugin';
    import type {PluginNode} from '$lib/graph/nodes';
    import type {Plugin, PluginId} from '$lib/graph/data';

    let node = $state<PluginNode>();
    let filter = $state('');
    const {nodes, actions, triggers} = getGraphContext();

    nodes.subscribe(nodes => (node = nodes.find(n => n.selected)));

    const sort = ([idA]: [PluginId, Plugin], [idB]: [PluginId, Plugin]) => {
        return extractPluginNamespace(idA).localeCompare(extractPluginNamespace(idB));
    };
    const onDragStart = (e: DragEvent, id: PluginId, plugin: Plugin) => {
        if (!e.dataTransfer) {
            return null;
        }

        e.dataTransfer.setData('application/exeflow+plugin:id', id);
        e.dataTransfer.setData('application/exeflow+plugin:type', plugin.type);
        e.dataTransfer.effectAllowed = 'move';
    };
    const filterPlugins = ([id, plugin]: [PluginId, Plugin]) => {
        return id.includes(filter) || plugin.description.includes(filter);
    };
</script>

{#if node}
    <h1>{humanPluginName(extractPluginName(node.data.id))}</h1>

    <InspectorEditor bind:node />
{:else}
    <h1>Nodes</h1>
    <input type="search" bind:value={filter} placeholder="Filter nodes..." />

    {#each [...Object.entries(triggers), ...Object.entries(actions)].filter(filterPlugins).toSorted(sort) as [id, plugin]}
        <div role="img" class="plugin" title={extractPluginNamespace(id)} draggable={true} style:--x-color-border={plugin.color} ondragstart={e => onDragStart(e, id, plugin)}>
            <img src={plugin.icon} alt="" />
            <div>
                <span class="name">{humanPluginName(extractPluginName(id))}</span>
                <span class="description">{plugin.description}</span>
            </div>
        </div>
    {/each}
{/if}

<style>
    .plugin {
        gap: 1rem;
        display: flex;
        padding: 0.5rem 1rem;
        align-items: center;
        flex-direction: row;

        color: var(--color-fg);
        border: 0.15rem solid transparent;
        cursor: grab;
        font-weight: bold;
        font-family: var(--flow-font);
        border-radius: var(--flow-border-radius-node);
        background-color: var(--flow-color-node);

        & img {
            height: 3rem;
            pointer-events: none;
        }

        & div {
            display: flex;
            flex-direction: column;

            & .name {
                color: var(--color-fg);
                font-weight: bold;
            }
            .description {
                color: var(--color-fg-1);
                font-weight: 200;
            }
        }

        &:hover {
            border: 0.15rem solid var(--x-color-border);
        }
    }
</style>
