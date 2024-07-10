<script lang="ts">
    import {fetchLogs} from '../../api/project/logs';
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

<div class="logs">
    {#await fetchLogs(projectId)}
        Loading...
    {:then logs}
        {#each logs as log}
            <div class="item">
                <span>{log.startedAt}</span>
                <span>{log.finishedAt}</span>

                <div class="plugins">
                    {#each log.plugins as plugin}
                        {@const image = actions[plugin]?.icon ?? triggers[plugin]?.icon ?? 'data:null'}

                        <img src={image} alt="" />
                    {/each}
                </div>
            </div>
        {/each}
    {/await}
</div>

<style>
    .logs {
        gap: 1rem;
        display: flex;
        flex-direction: column;
    }

    .item {
        display: flex;
        padding: 1rem;
        overflow: hidden;
        max-width: 40rem;
        flex-direction: column;

        border-radius: 1rem;
        background-color: var(--color-bg-1);
    }

    .plugins {
        display: flex;
        overflow: auto;
        flex-direction: row;
    }
</style>
