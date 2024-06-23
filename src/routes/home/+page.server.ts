import {redirect} from '@sveltejs/kit';

import type {Project} from '../api/project/project.js';

export const load = async ({locals}) => {
    const user = await locals.user();
    if (!user) throw redirect(301, '/auth/login');

    const projects = (await locals.db
        .selectFrom('projects')
        .select(['id', 'name', 'image', 'content'])
        .where('owner_id', '=', user.id)
        .orderBy(['updated_at desc', 'created_at desc'])
        .execute()) as Project[];

    return {user, projects};
};
