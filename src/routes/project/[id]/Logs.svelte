<script lang="ts">
    import {getLogsGroups} from '../../api/project/logs';
    import type {Action} from '$lib/core/plugins/action';
    import type {Trigger} from '$lib/core/plugins/trigger';
    import type {JsonSchema} from '$lib/schema/schema';

    interface Props {
        actions: Record<string, Action<JsonSchema>>;
        triggers: Record<string, Trigger<JsonSchema>>;
        projectId: string;
    }

    let {actions, triggers, projectId}: Props = $props();
</script>

<div class="main">
    {#await getLogsGroups(projectId) then logsGroups}
        {#if logsGroups.length === 0}
            <div class="empty">
                <span>No executions yet</span>
            </div>
        {:else}
            {#each logsGroups as logGroup}
                <div class="group">
                    <div class="plugins">
                        {#each logGroup.plugins as plugin, i}
                            {@const last = i === logGroup.plugins.length - 1}
                            {@const image = actions[plugin]?.icon ?? triggers[plugin]?.icon ?? 'data:null'}

                            <img src={image} alt="" title={plugin} width="32px" height="32px" />
                            {#if !last}
                                <span>➡</span>
                            {/if}
                        {/each}
                    </div>
                    <span>{logGroup.startedAt} - {logGroup.finishedAt}</span>
                </div>
            {/each}
        {/if}
    {/await}
</div>

<style>
    .main {
        gap: 1rem;
        display: flex;
        flex-direction: column;
    }

    .empty {
        display: flex;
        padding: 5rem;
        align-items: center;
        justify-content: center;

        border-radius: 0.5rem;
        background-color: var(--color-bg-1);
    }

    .group {
        gap: 0.5rem;
        display: flex;
        padding: 1rem;
        overflow: hidden;
        max-width: 40rem;
        flex-direction: column;

        border-radius: 0.5rem;
        background-color: var(--color-bg-1);
    }

    .plugins {
        gap: 0.5rem;
        height: 3rem;
        display: flex;
        overflow: auto;
        align-items: center;
        flex-direction: row;
    }
</style>
