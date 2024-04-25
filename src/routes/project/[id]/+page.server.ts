import {getProject} from '../../api/project/api.server';

export async function load({locals, params}) {
    const project = await getProject(locals.db, {id: params.id});

    return {project};
}
