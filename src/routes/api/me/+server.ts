import {json, error} from '@sveltejs/kit';

export const GET = async ({locals}) => {
    const user = await locals.user();

    if (user) {
        const {id, email} = user;
        return json({id, email});
    }
    throw error(403);
};
