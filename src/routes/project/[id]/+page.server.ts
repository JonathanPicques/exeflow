import {getProject} from '../../api/project/api.server';

export const load = async ({locals, params}) => {
    const project = await getProject(locals.db, {id: params.id});

    return {project};
};
