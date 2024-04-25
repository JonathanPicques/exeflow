import {json, error} from '@sveltejs/kit';
import {createProject, type Project} from './api.server';

export async function POST({locals}) {
    const userResult = await locals.supabase.auth.getUser();

    if (userResult.data.user) {
        return json(await createProject(locals.db, {name: 'New project', userId: userResult.data.user.id}));
    }
    throw error(500, userResult.error?.message ?? 'failed to retrieve user');
}
