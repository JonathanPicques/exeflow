import {getProject} from '$lib/projects/projects';

export const load = async ({locals, params}) => {
    const project = await getProject(locals.db, {id: params.id});

    return {project};
};
