import type {Project} from './project.service';

export const fetchListProjects = async () => {
    return (await (await fetch(`/api/project`, {method: 'GET'})).json()) as Project[];
};

export const fetchCreateProject = async ({name}: Pick<Project, 'name'>) => {
    return (await (
        await fetch(`/api/project`, {
            method: 'POST',
            body: JSON.stringify({name}),
            headers: {'Content-Type': 'application/json'},
        })
    ).json()) as Project;
};

export const fetchUpdateProject = async ({id, image, content}: Pick<Project, 'id' | 'image' | 'content'>) => {
    return (await (
        await fetch(`/api/project/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({image, content}),
        })
    ).json()) as {id: string};
};

export const fetchDeleteProject = async ({id}: Pick<Project, 'id'>) => {
    return (await (
        await fetch(`/api/project/${id}`, {
            method: 'DELETE',
        })
    ).json()) as {id: string};
};
