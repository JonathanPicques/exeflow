<script lang="ts">
    import {getGraphContext} from '$lib/graph/data';
    import type {Action, ActionId} from '$lib/plugins/@action';
    import type {Trigger, TriggerId} from '$lib/plugins/@trigger';

    const {actions, triggers} = getGraphContext();

    type Plugin = Action<unknown> | Trigger<unknown>;
    type PluginId = ActionId | TriggerId;

    const sort = ([idA, pluginA]: [PluginId, Plugin], [idB, pluginB]: [PluginId, Plugin]) => {
        const cmp = pluginB.type.localeCompare(pluginA.type);
        if (cmp === 0) {
            return idA.localeCompare(idB);
        }
        return cmp;
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

<aside>
    {#each [...Object.entries(triggers), ...Object.entries(actions)].toSorted(sort) as [id, trigger]}
        <div class="plugin" role="img" draggable={true} style:--x-color-border={trigger.color} on:dragstart={e => onDragStart(e, id, trigger)}>
            <img src={trigger.icon} alt="" />
            <span>{trigger.title}</span>
        </div>
    {/each}
</aside>

<style>
    aside {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
    }

    .plugin {
        display: flex;
        gap: 0.6rem;
        margin: 0.5rem;
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
