export const load = async ({url, locals}) => {
    const code = url.searchParams.get('code') as string | undefined;
    const error = url.searchParams.get('error') as string | undefined;
    const errorDescription = url.searchParams.get('error_description') as string | undefined;

    if (error) return {error: true, description: errorDescription ?? 'unable to validate you account'};
    if (!code) return {error: true, description: 'validation code is missing'};

    try {
        const response = await locals.supabase.auth.exchangeCodeForSession(code);
        if (response.error) throw response.error;
        return {success: true};
    } catch (e) {
        return {error: true, description: (e as Error).toString()};
    }
};
