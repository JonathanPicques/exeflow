import {error, json} from '@sveltejs/kit';

export async function DELETE({locals, params}) {
    const deleteResult = await locals.supabase.from('projects').delete().eq('id', params.id);

    if (deleteResult.count === 1) {
        return json({});
    }
    throw error(500, deleteResult.error?.message ?? 'failed to delete project');
}
