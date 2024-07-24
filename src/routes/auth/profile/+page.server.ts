import {redirect} from '@sveltejs/kit';

export const load = async ({locals}) => {
    const user = await locals.user();
    if (!user) throw redirect(302, '/');

    return {user};
};
