import type {Project} from './api.server';

export async function _POST() {
    return (await (await fetch(`/api/project`, {method: 'POST'})).json()) as Project;
}
