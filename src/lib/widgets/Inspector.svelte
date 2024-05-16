<script lang="ts">
    import {getGraphContext} from '$lib/graph/data';
    import {extractPluginName} from '$lib/helper/extractPluginId';
    import type {Action, ActionId} from '$lib/plugins/@action';
    import type {Trigger, TriggerId} from '$lib/plugins/@trigger';

    const {actions, triggers} = getGraphContext();

    type Plugin = Action<unknown> | Trigger<unknown>;
    type PluginId = ActionId | TriggerId;

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
    <div role="img" class="plugin" title={plugin.description} draggable={true} style:--x-color-border={plugin.color} on:dragstart={e => onDragStart(e, id, plugin)}>
        <img src={plugin.icon} alt="" />
        <span>{extractPluginName(id)}</span>
    </div>
{/each}

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
