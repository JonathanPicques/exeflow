<script lang="ts">
    import InspectorEditor from './InspectorEditor.svelte';
    import {getGraphContext} from '$lib/graph/data';
    import {extractPluginName} from '$lib/helper/plugin';
    import type {PluginNode} from '$lib/graph/nodes';
    import type {Plugin, PluginId} from '$lib/graph/data';

    const {nodes, actions, triggers} = getGraphContext();

    let node = $state<PluginNode>();
    nodes.subscribe(nodes => (node = nodes.find(n => n.selected)));

    const sort = ([, pluginA]: [PluginId, Plugin], [, pluginB]: [PluginId, Plugin]) => {
        return pluginB.type.localeCompare(pluginA.type);
    };
    const onDragStart = (e: DragEvent, id: PluginId, plugin: Plugin) => {
        if (!e.dataTransfer) {
            return null;
        }

        e.dataTransfer.setData('application/exeflow+plugin:id', id);
        e.dataTransfer.setData('application/exeflow+plugin:type', plugin.type);
        e.dataTransfer.effectAllowed = 'move';
    };
</script>

{#each [...Object.entries(triggers), ...Object.entries(actions)].toSorted(sort) as [id, plugin]}
    <div role="img" class="plugin" title={plugin.description} draggable={true} style:--x-color-border={plugin.color} ondragstart={e => onDragStart(e, id, plugin)}>
        <img src={plugin.icon} alt="" />
        <span>{extractPluginName(id)}</span>
    </div>
{/each}

{#if node}
    <InspectorEditor bind:node />
{/if}

<style>
    .plugin {
        display: flex;
        gap: 0.6rem;
        padding: 0.5rem 1rem;
        align-items: center;
        flex-direction: row;

        cursor: grab;
        font-family: 'Fira Mono', Monospace;
        font-weight: bold;

        border: 0.15rem solid transparent;
        border-radius: var(--flow-border-radius-node);
        background-color: var(--flow-color-node);

        & > img {
            pointer-events: none;
        }

        &:hover {
            border: 0.15rem solid var(--x-color-border);
        }
    }
</style>
