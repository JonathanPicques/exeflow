import type {Db} from '$lib/supabase/db.server';

import type {ProjectsId} from '$lib/supabase/gen/public/Projects';
import type {LogsExecId, LogsNodeId, LogsPluginId} from '$lib/supabase/gen/public/Logs';

export const insertLog = (
    db: Db,
    {
        execId,
        nodeId,
        pluginId,
        projectId,
        //
        index,
        config,
        results,
    }: {
        execId: string;
        nodeId: string;
        pluginId: string;
        projectId: string;
        //
        index: number;
        config: unknown;
        results: unknown;
    },
) => {
    db.insertInto('logs')
        .values({
            exec_id: execId as LogsExecId,
            node_id: nodeId as LogsNodeId,
            plugin_id: pluginId as LogsPluginId,
            project_id: projectId as ProjectsId,
            //
            index,
            config,
            results,
            //
            created_at: new Date(),
        })
        .execute()
        .catch(e => {
            console.error('failed to log', e); // silently ignore
        });
};
