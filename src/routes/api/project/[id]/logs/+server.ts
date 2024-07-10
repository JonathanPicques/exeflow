import {sql} from 'kysely';
import {json, error} from '@sveltejs/kit';

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

    const inner = locals.db
        .selectFrom('logs')
        .select([
            'exec_id',
            sql<Date>`max(created_at)`.as('ended_at'),
            sql<Date>`min(created_at)`.as('started_at'),
            sql<string[]>`json_agg(plugin_id order by "index" asc)`.as('plugins'),
        ])
        .groupBy('exec_id')
        .orderBy('exec_id')
        .where('project_id', '=', params.id as ProjectsId);
    const query = await locals.db
        .selectFrom(inner.as('inner'))
        .select(['exec_id', 'plugins', 'ended_at', 'started_at'])
        .orderBy(['started_at', 'ended_at'])
        //
        .execute();

    return json(query);
};
