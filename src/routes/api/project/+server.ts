import {json, error} from '@sveltejs/kit';

import {valid} from '$lib/schema/validate';
import {AppError} from '$lib/helper/error';
import {getProjects, createProject} from '$lib/projects/projects';

export const GET = async ({locals}) => {
    const user = await locals.user();

    if (user) {
        try {
            return json(await getProjects(locals.db, {ownerId: user.id}));
        } catch (e) {
            if (e instanceof AppError) {
                return e.response();
            }
            throw e;
        }
    }
    throw error(401);
};

export const POST = async ({locals, request}) => {
    const user = await locals.user();
    const body = await request.json();

    if (user) {
        let name = 'New project';
        if (valid(body, {type: 'object', required: ['name'], properties: {name: {type: 'string'}}})) {
            name = body.name;
        }
        try {
            return json(await createProject(locals.db, {name, ownerId: user.id}));
        } catch (e) {
            if (e instanceof AppError) {
                return e.response();
            }
            throw e;
        }
    }
    throw error(401);
};
