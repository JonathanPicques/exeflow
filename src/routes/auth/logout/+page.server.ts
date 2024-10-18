import {error, redirect} from '@sveltejs/kit';

export const load = async ({locals}) => {
    const response = await locals.supabase.auth.signOut();
    if (response.error) throw error(500, response.error.message);

    throw redirect(302, '/');
};
