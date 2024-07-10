import {json, error} from '@sveltejs/kit';

import type {LogsExecId} from '$lib/supabase/gen/public/Logs';
import type {ProjectsId} from '$lib/supabase/gen/public/Projects';

export const GET = async ({locals, params}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const project = await locals.db
        .selectFrom('projects')
        .select('id')
        .where('id', '=', params.id as ProjectsId)
        .where('owner_id', '=', user.id)
        .limit(1)
        .executeTakeFirst();
    if (!project) throw error(404);

    const logs = await locals.db
        .selectFrom('logs')
        .select(['config', 'results', 'plugin_id', 'created_at'])
        .where('exec_id', '=', params.exec_id as LogsExecId)
        .where('project_id', '=', params.id as ProjectsId)
        .orderBy('created_at')
        .execute();

    return json(
        logs.map(({plugin_id, config, results, created_at}) => ({
            config,
            results,
            pluginId: plugin_id,
            createdAt: created_at,
        })),
    );
};
