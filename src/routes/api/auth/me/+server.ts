import {json, error} from '@sveltejs/kit';

export const GET = async ({locals}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    return json({id: user.id, email: user.email});
};
