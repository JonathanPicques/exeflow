import {error} from '@sveltejs/kit';

export async function load({locals}) {
    const user = await locals.user();
    const projects = await locals.supabase.from('projects').select('id, name');

    if (projects.error) {
        throw error(500, projects.error.message);
    }
    return {user, projects: projects.data};
}
