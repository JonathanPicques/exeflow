import {json, error} from '@sveltejs/kit';
import {getProjects, createProject} from './api.server';

export async function GET({locals}) {
    const user = await locals.user();

    if (user) {
        return json(await getProjects(locals.db, {ownerId: user.id}));
    }
    throw error(403);
}

export async function POST({locals}) {
    const user = await locals.user();

    if (user) {
        return json(await createProject(locals.db, {name: 'New project', ownerId: user.id}));
    }
    throw error(403);
}
