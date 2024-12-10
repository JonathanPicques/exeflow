<script lang="ts">
    import {getGraphContext} from '$lib/core/core';
    import {useStore, useSvelteFlow} from '@xyflow/svelte';
    import {humanPluginName, extractPluginName, extractPluginNamespace} from '$lib/core/parser/parser';
    import type {Plugin, PluginId} from '$lib/core/core';

    let props: {id: string; plugin: Plugin} = $props();
    const {createNode} = getGraphContext();
    const {width, height} = useStore();
    const {screenToFlowPosition} = useSvelteFlow();

    const onDblClick = (id: PluginId, plugin: Plugin) => {
        createNode(id, plugin.type, screenToFlowPosition({x: $width / 2, y: $height / 2}));
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

<div
    role="listitem"
    class="plugin"
    title={extractPluginNamespace(props.id)}
    style:--x-color-border={props.plugin.color}
    draggable={true}
    ondblclick={() => onDblClick(props.id, props.plugin)}
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
        position: relative;

        gap: 0.5rem;
        display: flex;
        padding: 1rem;
        user-select: none;
        flex-direction: column;

        color: var(--color-fg);
        border: 0.15rem solid transparent;
        cursor: grab;
        border-radius: var(--flow-border-radius-node);
        background-color: var(--color-bg-1);

        transition: 0.3s;

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

        &::before {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            content: '';
            opacity: 0.1;
            border-radius: calc(var(--flow-border-radius-node) - 0.15rem);
            background-image: linear-gradient(to bottom, transparent, var(--x-color-border));
        }
    }
</style>
