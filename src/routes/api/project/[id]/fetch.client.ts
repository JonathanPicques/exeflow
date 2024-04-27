import type {Project} from '../api.server';

export const _PATCH = async ({id, content}: Pick<Project, 'id' | 'content'>) => {
    return (await (
        await fetch(`/api/project/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(content),
        })
    ).json()) as {id: string};
};

export const _DELETE = async ({id}: Pick<Project, 'id'>) => {
    return (await (
        await fetch(`/api/project/${id}`, {
            method: 'DELETE',
        })
    ).json()) as {id: string};
};
