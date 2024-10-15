import {importPlugins} from '$lib/core/core';

export const load = async ({data: {project, secrets, mobileHint}}) => {
    const {actions, triggers} = await importPlugins();

    return {project, secrets, actions, triggers, mobileHint};
};
