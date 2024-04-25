import {error, redirect} from '@sveltejs/kit';

export async function load({locals}) {
    const result = await locals.supabase.auth.signOut();

    if (result.error) {
        throw error(500, result.error.message);
    }
    return {redirectTo: '/'};
}
