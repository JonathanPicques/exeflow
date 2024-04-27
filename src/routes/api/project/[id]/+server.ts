import {valid} from '$lib/schema/validate';
import {json, error} from '@sveltejs/kit';
import {updateProject, deleteProject} from '../api.server';

export const PATCH = async ({locals, params, request}) => {
    const body = await request.json();

    if (valid(body, {type: 'object', required: ['edges', 'nodes'], properties: {edges: {}, nodes: {}}})) {
        await updateProject(locals.db, {id: params.id, content: body});
        return json({id: params.id});
    }
    throw error(400, 'invalid body');
};

export const DELETE = async ({locals, params}) => {
    await deleteProject(locals.db, {id: params.id});
    return json({id: params.id});
};
