import {error, json} from '@sveltejs/kit';

export async function POST({locals}) {
    const userResult = await locals.supabase.auth.getUser();

    if (userResult.data.user) {
        const project = await locals.db.insertInto('projects').values({name: 'project', owner_id: userResult.data.user.id}).returningAll().executeTakeFirstOrThrow();

        return json(project);
    }
    throw error(500, userResult.error?.message ?? 'failed to retrieve user');
}
