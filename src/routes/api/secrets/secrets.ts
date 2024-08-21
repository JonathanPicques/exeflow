export interface Secret {
    key: string;
    value: string;
}

export const getSecrets = async () => {
    const response = await fetch(`/api/secrets`, {method: 'GET'});

    return (await response.json()) as Secret[];
};

export const putSecret = async ({key, value}: Secret) => {
    const response = await fetch(`/api/secrets`, {
        method: 'PUT',
        body: JSON.stringify({key, value}),
        headers: {'Content-Type': 'application/json'},
    });

    return (await response.json()) as Secret;
};

export const deleteSecret = async ({key}: Pick<Secret, 'key'>) => {
    await fetch(`/api/secrets/${key}`, {method: 'DELETE'});
};
