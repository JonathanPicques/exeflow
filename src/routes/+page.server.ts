import {getProjects} from './api/project/api.server';

export async function load({locals}) {
    const user = await locals.user();
    const projects = await getProjects(locals.db, {userId: user.id});

    return {user, projects};
}
