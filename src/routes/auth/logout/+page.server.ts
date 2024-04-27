import {error, redirect} from '@sveltejs/kit';

export const load = async ({locals}) => {
    const result = await locals.supabase.auth.signOut();

    if (result.error) {
        throw error(500, result.error.message);
    }
    throw redirect(303, '/');
};
