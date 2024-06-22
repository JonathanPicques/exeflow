import {redirect} from '@sveltejs/kit';

import {getProjects} from '../api/project/project.service';

export const load = async ({locals}) => {
    const user = await locals.user();

    if (!user) {
        throw redirect(301, '/auth/login');
    }
    return {
        user,
        projects: await getProjects(locals.db, {ownerId: user.id}),
    };
};
