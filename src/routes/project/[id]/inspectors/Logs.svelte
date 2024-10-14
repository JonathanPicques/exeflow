<script lang="ts">
    import moment from 'moment';

    import {getLogsGroups} from '../../../api/project/logs';
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
            <div>
                <span>No logs available yet</span>
            </div>
        {:else}
            <div class="list">
                {#each logsGroups as logGroup}
                    {@const startedAgoFromNow = moment(logGroup.startedAt).fromNow()}
                    {@const finishedAtFromNow = moment(logGroup.finishedAt).fromNow()}

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
                        {#if startedAgoFromNow === finishedAtFromNow}
                            <span>Started and finished {startedAgoFromNow}</span>
                        {:else}
                            <span>Started {startedAgoFromNow} and finished {finishedAtFromNow}</span>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    {/await}
</div>

<style>
    .main {
        height: 100%;
        padding: 1rem;
        overflow: hidden;
    }

    .list {
        gap: 0.5rem;
        height: 100%;
        display: flex;
        overflow: auto;
        padding-right: 0.5rem;
        flex-direction: column;
    }

    .group {
        gap: 0.5rem;
        display: flex;
        padding: 1rem;
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
