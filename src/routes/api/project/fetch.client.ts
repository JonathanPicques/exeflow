import type {Project} from '$lib/projects/projects';

export const _GET = async () => {
    return (await (await fetch(`/api/project`, {method: 'GET'})).json()) as Project[];
};

export const _POST = async ({name}: Pick<Project, 'name'>) => {
    return (await (
        await fetch(`/api/project`, {
            method: 'POST',
            body: JSON.stringify({name}),
            headers: {'Content-Type': 'application/json'},
        })
    ).json()) as Project;
};
