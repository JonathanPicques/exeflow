import {valid} from '$lib/schema/validate';
import {json, error} from '@sveltejs/kit';
import {updateProject, deleteProject} from '../api.server';

export async function PATCH({locals, params, request}) {
    const body = await request.json();

    if (valid(body, {type: 'object', required: ['edges', 'nodes'], properties: {edges: {}, nodes: {}}})) {
        await updateProject(locals.db, {id: params.id, content: body});
        return json({id: params.id});
    }
    throw error(400, 'invalid body');
}

export async function DELETE({locals, params}) {
    await deleteProject(locals.db, {id: params.id});
    return json({id: params.id});
}
