import {redirect} from '@sveltejs/kit';

import type {Project} from '../api/project/project';

export const load = async ({locals}) => {
    const user = await locals.user();
    if (!user) throw redirect(302, '/auth/login');

    const projects = (await locals.db
        .selectFrom('projects')
        .select(['id', 'name', 'image', 'content', 'created_at', 'updated_at'])
        .where('owner_id', '=', user.id)
        .orderBy(['updated_at desc', 'created_at desc'])
        .execute()) as Project[];

    return {user, projects};
};
