import {loadPlugins} from '$lib/helper/plugin.js';

export const load = async ({data: {project}}) => {
    const {actions, triggers} = await loadPlugins();

    return {project, actions, triggers};
};
