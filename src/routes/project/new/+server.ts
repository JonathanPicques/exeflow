import {error, json} from '@sveltejs/kit';

export async function POST({locals}) {
    const insertResult = await locals.supabase.from('projects').insert({name: 'project'}).select().single();

    if (insertResult.data) {
        return json(insertResult.data);
    }
    throw error(500, insertResult.error?.message ?? 'failed to create project');
}
