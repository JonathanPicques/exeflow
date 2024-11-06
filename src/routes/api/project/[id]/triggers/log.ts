import type {Db} from '$lib/supabase/db.server';

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
    db.insertInto('public.logs')
        .values({
            exec_id: execId,
            node_id: nodeId,
            plugin_id: pluginId,
            project_id: projectId,
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
