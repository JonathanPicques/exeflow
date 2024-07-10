import type {Project} from './project';
import type {PluginId} from '$lib/core/core';

export interface Logs {
    execId: string;
    plugins: PluginId[];
    startedAt: Date;
    finishedAt: Date;
}

export interface LogsEntry {
    pluginId: PluginId;
    createdAt: Date;
}

export const fetchLogs = async (projectId: Project['id']) => {
    const response = await fetch(`/api/project/${projectId}/logs`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });

    return (await response.json()) as Logs[];
};

export const fetchLogsEntries = async (projectId: Project['id'], logsExecId: Logs['execId']) => {
    const response = await fetch(`/api/project/${projectId}/logs/${logsExecId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });

    return (await response.json()) as LogsEntry[];
};
