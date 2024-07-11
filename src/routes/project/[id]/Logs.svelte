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
        {#each logsGroups as logGroup}
            <div class="group">
                <div class="plugins">
                    {#each logGroup.plugins as plugin}
                        {@const image = actions[plugin]?.icon ?? triggers[plugin]?.icon ?? 'data:null'}

                        <img src={image} alt="" title={plugin} width="32px" height="32px" />
                    {/each}
                </div>
                <span>{logGroup.startedAt} - {logGroup.finishedAt}</span>
            </div>
        {/each}
    {/await}
</div>

<style>
    .main {
        gap: 1rem;
        display: flex;
        flex-direction: column;
    }

    .group {
        gap: 0.5rem;
        display: flex;
        padding: 1rem;
        overflow: hidden;
        max-width: 40rem;
        flex-direction: column;

        border-radius: 1rem;
        background-color: var(--color-bg-1);
    }

    .plugins {
        height: 3rem;
        display: flex;
        overflow: auto;
        flex-direction: row;
    }
</style>
