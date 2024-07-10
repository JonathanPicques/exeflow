import type {Project} from './project';
import type {PluginId} from '$lib/core/core';

export interface LogsGroups {
    execId: string;
    plugins: PluginId[];
    startedAt: Date;
    finishedAt: Date;
}

export interface LogsEntry {
    pluginId: PluginId;
    createdAt: Date;
}

export const fetchLogsGroups = async (projectId: Project['id']) => {
    const response = await fetch(`/api/project/${projectId}/logs`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });

    return (await response.json()) as LogsGroups[];
};

export const fetchLogsEntries = async (projectId: Project['id'], logsExecId: LogsGroups['execId']) => {
    const response = await fetch(`/api/project/${projectId}/logs/${logsExecId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });

    return (await response.json()) as LogsEntry[];
};
