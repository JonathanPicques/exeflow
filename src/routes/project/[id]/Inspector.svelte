<script lang="ts">
    import InspectorEditor from './InspectorEditor.svelte';
    import InspectorTrigger from './InspectorTrigger.svelte';

    import {getGraphContext} from '$lib/graph/data';
    import {humanPluginName, extractPluginName, extractPluginNamespace} from '$lib/helper/plugin';
    import type {PluginNode} from '$lib/graph/nodes';
    import type {Plugin, PluginId} from '$lib/graph/data';

    const {nodes, actions, triggers, findPlugin} = getGraphContext();

    let node = $state<PluginNode>();
    let plugin = $derived(node && findPlugin(node.data.id, node.data.type));
    let filter = $state('');

    nodes.subscribe(nodes => {
        node = nodes.find(n => n.selected);
    });

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

<div class="main">
    {#if node && plugin}
        <h1>
            <img src={plugin.icon} alt="" />
            <span>{humanPluginName(extractPluginName(node.data.id))}</span>
        </h1>

        <div class="list">
            {#if node.data.type === 'trigger'}
                <InspectorTrigger {node} />
            {/if}
            <InspectorEditor bind:node />
        </div>
    {:else}
        <h1>Nodes</h1>
        <input type="search" bind:value={filter} placeholder="Filter nodes..." />

        <div class="list">
            {#each [...Object.entries(triggers), ...Object.entries(actions)].filter(filterPlugins).toSorted(sort) as [id, plugin]}
                <div
                    role="img"
                    class="plugin"
                    title={extractPluginNamespace(id)}
                    style:--x-color-border={plugin.color}
                    draggable={true}
                    ondragstart={e => onDragStart(e, id, plugin)}
                >
                    <img src={plugin.icon} alt="" />
                    <div>
                        <span class="name">{humanPluginName(extractPluginName(id))}</span>
                        <span class="description">{plugin.description}</span>
                    </div>
                </div>
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
        height: 100%;
        display: grid;
        overflow: hidden;
        align-content: start;
    }

    .list {
        gap: 0.5rem;
        height: 100%;
        display: grid;
        overflow: auto;
        padding-right: 0.5rem;
    }

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
