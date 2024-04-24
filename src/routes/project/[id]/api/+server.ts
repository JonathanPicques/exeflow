import {json} from '@sveltejs/kit';

export async function DELETE({locals, params}) {
    await locals.db.deleteFrom('projects').where('id', '=', params.id).executeTakeFirstOrThrow();
    return json({});
}
