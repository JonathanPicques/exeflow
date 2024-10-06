import {error} from '@sveltejs/kit';

import type {Project} from '../../api/project/project';
import type {ProjectsId} from '$lib/supabase/gen/public/Projects';

export const load = async ({locals, params, parent}) => {
    const {user} = await parent();
    if (!user) throw error(401);

    const project = (await locals.db
        .selectFrom('projects')
        .select(['id', 'name', 'image', 'content', 'created_at', 'updated_at'])
        .where('id', '=', params.id as ProjectsId)
        .where('owner_id', '=', user.id)
        .limit(1)
        .executeTakeFirst()) as Project | undefined;
    if (!project) throw error(404);

    const secrets = await locals.db
        //
        .selectFrom('secrets')
        .select(['key', 'value'])
        .where('owner_id', '=', user.id)
        .execute();

    return {project, secrets};
};
