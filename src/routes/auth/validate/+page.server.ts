export const load = async ({url, locals}) => {
    const code = url.searchParams.get('code') as string | undefined;
    const error = url.searchParams.get('error') as string | undefined;
    const errorCode = url.searchParams.get('error_code') as string | undefined;
    const errorDescription = url.searchParams.get('error_description') as string | undefined;

    if (code && !error) {
        const result = await locals.supabase.auth.exchangeCodeForSession(code);

        if (result.data.user) {
            return {success: true};
        }
        return {error: true, code: errorCode ?? '403', description: errorDescription ?? 'unable to validate you account'};
    }
    return {error: true, code: errorCode ?? '001', description: errorDescription ?? 'validation failed'};
};
