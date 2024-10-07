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
        flex-direction: column;
        padding: 1rem;

        color: var(--color-fg);
        border: 0.15rem solid transparent;
        cursor: grab;
        font-weight: bold;
        font-family: var(--font-mono);
        border-radius: var(--flow-border-radius-node);
        background-color: var(--flow-color-node);

        & img {
            pointer-events: none;
        }

        & div {
            display: flex;
            flex-direction: row;
            gap: 0.6rem;

            & .name {
                color: var(--color-fg);
                font-weight: bold;
            }
        }

        &:hover {
            border: 0.15rem solid var(--x-color-border);
        }
        & .name {
            font-weight: 700;
        }
        & .description {
            color: var(--color-fg-1);
            font-weight: 200;
            font-size: 0.75rem;
        }
    }
</style>
