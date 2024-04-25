import {json} from '@sveltejs/kit';
import {deleteProject} from '../api.server';

export async function DELETE({locals, params}) {
    await deleteProject(locals.db, {id: params.id});
    return json({id: params.id});
}
