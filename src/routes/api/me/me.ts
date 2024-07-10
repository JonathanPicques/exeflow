import {valid} from '$lib/schema/validate';

export const getMe = async () => {
    const response = await fetch(`/api/me`, {method: 'GET'});

    if (response.status === 200) {
        const user = await response.json();
        if (valid(user, {type: 'object', required: ['id', 'email'], properties: {id: {type: 'string'}, email: {type: 'string'}}})) {
            return user;
        }
    }
    return undefined;
};
