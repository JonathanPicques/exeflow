import {json, error} from '@sveltejs/kit';
import type {RequestHandler} from './$types';

export const GET: RequestHandler = async ({locals}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    return json({id: user.id, email: user.email});
};
