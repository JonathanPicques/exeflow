import {redirect} from '@sveltejs/kit';

export const load = async ({locals}) => {
    const user = await locals.user();

    if (!user) {
        throw redirect(301, '/auth/login');
    }
    return {user};
};
