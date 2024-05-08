<script lang="ts">
    import {getGraphContext} from '$lib/graph/data';
    import type {Action, ActionId} from '$lib/plugins/@action';
    import type {Trigger, TriggerId} from '$lib/plugins/@trigger';

    const {actions, triggers} = getGraphContext();

    const sort = (a: [ActionId | TriggerId, unknown], b: [ActionId | TriggerId, unknown]) => a.length - b.length - a[0].localeCompare(b[0]);
    const onDragStart = (e: DragEvent, id: ActionId | TriggerId, plugin: Action<unknown> | Trigger<unknown>) => {
        if (!e.dataTransfer) {
            return null;
        }

        e.dataTransfer.setData('application/exeflow+plugin:id', id);
        e.dataTransfer.setData('application/exeflow+plugin:type', plugin.type);
        e.dataTransfer.effectAllowed = 'move';
    };
</script>

<aside>
    {#each Object.entries(triggers).toSorted(sort) as [id, trigger]}
        <div class="trigger" role="img" on:dragstart={e => onDragStart(e, id, trigger)} draggable={true}>
            <img src={trigger.icon} alt="trigger icon" />
            <span>{trigger.title}</span>
        </div>
    {/each}
    {#each Object.entries(actions).toSorted(sort) as [id, action]}
        <div class="action" role="img" on:dragstart={e => onDragStart(e, id, action)} draggable={true}>
            <img src={action.icon} alt="action icon" />
            <span>{action.title}</span>
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

    .action {
        color: var(--color-action);

        &:hover {
            border: 0.15rem solid var(--color-action);
        }
    }

    .trigger {
        color: var(--color-trigger);

        &:hover {
            border: 0.15rem solid var(--color-trigger);
        }
    }

    .action,
    .trigger {
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
        border-radius: 0.3rem;
        background-color: var(--flow-color-node-bg);

        & > img {
            pointer-events: none;
        }
    }
</style>
