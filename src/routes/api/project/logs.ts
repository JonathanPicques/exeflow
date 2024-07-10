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

export const getLogsGroups = async (projectId: Project['id']) => {
    const response = await fetch(`/api/project/${projectId}/logs`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });

    return (await response.json()) as LogsGroups[];
};

export const getLogsEntries = async (projectId: Project['id'], logsExecId: LogsGroups['execId']) => {
    const response = await fetch(`/api/project/${projectId}/logs/${logsExecId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });

    return (await response.json()) as LogsEntry[];
};

export const deleteLogsGroups = async (projectId: Project['id']) => {
    await fetch(`/api/project/${projectId}/logs`, {method: 'DELETE'});
};

export const deleteLogsEntries = async (projectId: Project['id'], logsExecId: LogsGroups['execId']) => {
    await fetch(`/api/project/${projectId}/logs/${logsExecId}`, {method: 'DELETE'});
};
