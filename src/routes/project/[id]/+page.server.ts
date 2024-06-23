import {error} from '@sveltejs/kit';

import type {Project} from '../../api/project/project';
import type {ProjectsId} from '$lib/supabase/gen/public/Projects';

export const load = async ({locals, params, parent}) => {
    const project = (await locals.db
        .selectFrom('projects')
        .select(['id', 'name', 'image', 'content'])
        .where('id', '=', params.id as ProjectsId)
        .where('owner_id', '=', (await parent()).user.id)
        .executeTakeFirst()) as Project | undefined;
    if (!project) throw error(404);
    return {project};
};
