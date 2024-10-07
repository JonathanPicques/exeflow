<script lang="ts">
    import type {Plugin, PluginId} from '$lib/core/core';
    import {extractPluginName, extractPluginNamespace, humanPluginName} from '$lib/core/parse';

    let props: {id: string; plugin: Plugin} = $props();

    const onDragStart = (e: DragEvent, id: PluginId, plugin: Plugin) => {
        if (!e.dataTransfer) {
            return null;
        }

        e.dataTransfer.setData('application/exeflow+plugin:id', id);
        e.dataTransfer.setData('application/exeflow+plugin:type', plugin.type);
        e.dataTransfer.effectAllowed = 'move';
    };
</script>

<div
    role="listitem"
    class="plugin"
    title={extractPluginNamespace(props.id)}
    style:--x-color-border={props.plugin.color}
    draggable={true}
    ondragstart={e => onDragStart(e, props.id, props.plugin)}
>
    <div>
        <img src={props.plugin.icon} alt="" width="24px" height="24px" />
        <span class="name">{humanPluginName(extractPluginName(props.id))}</span>
    </div>
    <span class="description">{props.plugin.description}</span>
</div>

<style>
    .plugin {
        gap: 0.5rem;
        display: flex;
        padding: 1rem;
        flex-direction: column;

        color: var(--color-fg);
        border: 0.15rem solid transparent;
        cursor: grab;
        border-radius: var(--flow-border-radius-node);
        background-color: var(--color-bg-1);

        & img {
            pointer-events: none;
        }

        & div {
            gap: 0.6rem;
            display: flex;
            flex-direction: row;

            & .name {
                color: var(--color-fg);
                font-size: 1.1rem;
                font-weight: bold;
            }
        }

        &:hover {
            border: 0.15rem solid var(--x-color-border);
        }
        & .description {
            color: var(--color-fg-1);
            font-size: 0.9rem;
        }
    }
</style>
