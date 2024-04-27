import {valid} from '$lib/schema/validate';
import {json, error} from '@sveltejs/kit';
import {getProjects, createProject} from './api.server';

export async function GET({locals}) {
    const user = await locals.user();

    if (user) {
        return json(await getProjects(locals.db, {ownerId: user.id}));
    }
    throw error(403);
}

export async function POST({locals, request}) {
    const user = await locals.user();
    const body = await request.json();

    if (user) {
        let name = 'New project';
        if (valid(body, {type: 'object', required: ['name'], properties: {name: {type: 'string'}}})) {
            name = body.name;
        }
        return json(await createProject(locals.db, {name, ownerId: user.id}));
    }
    throw error(403);
}
