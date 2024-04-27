import {valid} from '$lib/schema/validate';
import {json, error} from '@sveltejs/kit';
import {getProjects, createProject} from './api.server';

export const GET = async ({locals}) => {
    const user = await locals.user();

    if (user) {
        return json(await getProjects(locals.db, {ownerId: user.id}));
    }
    throw error(403);
};

export const POST = async ({locals, request}) => {
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
};
