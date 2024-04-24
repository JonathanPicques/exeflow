import {error, json} from '@sveltejs/kit';

export async function POST({locals}) {
    const userResult = await locals.supabase.auth.getUser();

    if (userResult.data.user) {
        const insertResult = await locals.supabase.from('projects').insert({name: 'project', owner_id: userResult.data.user.id}).select().single();

        if (insertResult.data) {
            return json(insertResult.data);
        }
        throw error(500, insertResult.error?.message ?? 'failed to create project');
    }
    throw error(500, userResult.error?.message ?? 'failed to retrieve user');
}
