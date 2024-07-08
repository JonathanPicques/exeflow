import {importPlugins} from '$lib/core/core';

export const load = async ({data: {project}}) => {
    const {actions, triggers} = await importPlugins();

    return {project, actions, triggers};
};
