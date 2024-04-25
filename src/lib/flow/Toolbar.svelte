<script lang="ts">
    import type {Action} from '$lib/graph/action';
    import type {Trigger} from '$lib/graph/trigger';

    export let actions: Record<string, Action<unknown>>;
    export let triggers: Record<string, Trigger<unknown>>;

    const onDragStart = (e: DragEvent, name: string, type: string) => {
        if (!e.dataTransfer) {
            return null;
        }

        e.dataTransfer.setData('application/svelteflow:name', name);
        e.dataTransfer.setData('application/svelteflow:type', type);
        e.dataTransfer.effectAllowed = 'move';
    };
</script>

<aside>
    {#each Object.entries(actions) as [name, action]}
        <div class="action" role="doc-part" on:dragstart={e => onDragStart(e, name, action.type)} draggable={true}>
            <img src={action.icon} alt="action icon" />
            <span>{action.title}</span>
        </div>
    {/each}
    {#each Object.entries(triggers) as [name, trigger]}
        <div class="trigger" role="doc-part" on:dragstart={e => onDragStart(e, name, trigger.type)} draggable={true}>
            <img src={trigger.icon} alt="trigger icon" />
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

    .action {
        --node-color: #f3ce39;

        color: var(--node-color);
    }

    .trigger {
        --node-color: #f54e9e;

        color: var(--node-color);
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
        background-color: var(--node-bg-color);

        & > img {
            pointer-events: none;
        }

        &:hover {
            border: 2px solid var(--node-color);
        }
    }
</style>
