import {getProject} from '../../api/project/project.service';

export const load = async ({locals, params}) => {
    return {
        project: await getProject(locals.db, {id: params.id}),
    };
};
