import {error, redirect} from '@sveltejs/kit';

export const load = async ({url, locals}) => {
    const err = url.searchParams.get('error') as string | undefined;
    const code = url.searchParams.get('code') as string | undefined;
    const errorDescription = url.searchParams.get('error_description') as string | undefined;

    if (err) throw error(500, errorDescription ?? 'server error');
    if (!code) throw error(400, errorDescription ?? 'confirm code is missing');

    const response = await locals.supabase.auth.exchangeCodeForSession(code);
    if (response.error) {
        throw error(response.error.status ?? 500, response.error.message);
    }
    throw redirect(303, '/auth/profile/change-password');
};
