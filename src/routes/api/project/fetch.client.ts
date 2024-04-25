import type {Project} from './api.server';

export async function _GET() {
    return (await (await fetch(`/api/project`, {method: 'GET'})).json()) as Project[];
}

export async function _POST({name = 'TODO'}: Pick<Project, 'name'>) {
    return (await (
        await fetch(`/api/project`, {
            method: 'POST',
            body: JSON.stringify({name}),
            headers: {'Content-Type': 'application/json'},
        })
    ).json()) as Project;
}
