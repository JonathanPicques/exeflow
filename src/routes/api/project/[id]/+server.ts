import {json} from '@sveltejs/kit';
import {deleteProject, updateProject} from '../api.server';

// TODO: validate body

export async function PATCH({locals, params, request}) {
    await updateProject(locals.db, {id: params.id, content: await request.json()});
    return json({id: params.id});
}

export async function DELETE({locals, params}) {
    await deleteProject(locals.db, {id: params.id});
    return json({id: params.id});
}
