import {json, error} from '@sveltejs/kit';

import {valid} from '$lib/schema/validate';
import {AppError} from '$lib/helper/appError';
import {getProject, updateProject, deleteProject} from '$lib/projects/projects';

export const GET = async ({locals, params}) => {
    try {
        return json(await getProject(locals.db, {id: params.id}));
    } catch (e) {
        if (e instanceof AppError) {
            return e.response();
        }
        throw e;
    }
};

export const PATCH = async ({locals, params, request}) => {
    const body = await request.json();

    if (valid(body, {type: 'object', required: ['edges', 'nodes'], properties: {edges: {}, nodes: {}}})) {
        try {
            await updateProject(locals.db, {id: params.id, content: body});
            return json({id: params.id});
        } catch (e) {
            if (e instanceof AppError) {
                throw e.error();
            }
            throw e;
        }
    }
    throw error(400, 'invalid body');
};

export const DELETE = async ({locals, params}) => {
    try {
        await deleteProject(locals.db, {id: params.id});
        return json({id: params.id});
    } catch (e) {
        if (e instanceof AppError) {
            return e.response();
        }
        throw e;
    }
};