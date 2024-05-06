import {getProject} from '$lib/projects/projects';

export const load = async ({locals, params}) => {
    return {
        project: await getProject(locals.db, {id: params.id}),
    };
};
