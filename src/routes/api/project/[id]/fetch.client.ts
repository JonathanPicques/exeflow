export async function _DELETE({id}: {id: string}) {
    return (await (await fetch(`/api/project/${id}`, {method: 'DELETE'})).json()) as {id: string};
}
