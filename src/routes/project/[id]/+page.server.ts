import {error} from '@sveltejs/kit';

export async function load({locals, params}) {
    const projects = await locals.supabase.from('projects').select('id, name, content').eq('id', params.id).limit(1);

    if (projects.error) {
        throw error(500);
    }
    if (projects.data.length === 0) {
        throw error(404, 'project not found');
    }
    return {project: projects.data[0]!};
}
