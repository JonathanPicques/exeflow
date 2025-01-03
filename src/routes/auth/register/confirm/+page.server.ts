export const load = async ({url, locals}) => {
    const err = url.searchParams.get('error') as string | undefined;
    const code = url.searchParams.get('code') as string | undefined;
    const errorDescription = url.searchParams.get('error_description') as string | undefined;

    if (err) return {error: {message: errorDescription ?? 'server error'}};
    if (!code) return {error: {message: errorDescription ?? 'confirm code is missing'}};

    const response = await locals.supabase.auth.exchangeCodeForSession(code);
    if (response.error) {
        return {error: {message: response.error.message}};
    }
    return {success: {}};
};
