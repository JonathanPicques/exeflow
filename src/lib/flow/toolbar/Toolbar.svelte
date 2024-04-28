<script lang="ts">
    import type {Action, ActionId} from '$lib/plugins/@action';
    import type {Trigger, TriggerId} from '$lib/plugins/@trigger';

    export let actions: Record<ActionId, Action<unknown>>;
    export let triggers: Record<TriggerId, Trigger<unknown>>;

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
        color: var(--action-color);

        &:hover {
            border: 2px solid var(--action-color);
        }
    }

    .trigger {
        color: var(--trigger-color);

        &:hover {
            border: 2px solid var(--trigger-color);
        }
    }

    .action,
    .trigger {
        display: flex;
        align-items: center;
        flex-direction: row;

        font-family: 'Fira Mono', Monospace;
        font-weight: bold;

        gap: 10px;
        margin: 0.5rem;
        cursor: grab;
        padding: 0.5rem 1rem;
        border: 2px solid transparent;
        border-radius: 5px;
        background-color: var(--flow-node-background-color);

        & > img {
            pointer-events: none;
        }
    }
</style>
