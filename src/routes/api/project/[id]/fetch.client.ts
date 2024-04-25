import type {Project} from '../api.server';

export async function _PATCH({id, content}: Pick<Project, 'id' | 'content'>) {
    return (await (
        await fetch(`/api/project/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(content),
        })
    ).json()) as {id: string};
}

export async function _DELETE({id}: Pick<Project, 'id'>) {
    return (await (
        await fetch(`/api/project/${id}`, {
            method: 'DELETE',
        })
    ).json()) as {id: string};
}
