import {fail} from '@sveltejs/kit';

import {rootUrl} from '$lib/core/env/env.server';

export const actions = {
    default: async ({locals, request}) => {
        const form = await request.formData();
        const email = form.get('email') as string;
        const password = form.get('password') as string;
        const confirmPassword = form.get('confirmPassword') as string;

        if (email && password && confirmPassword && password === confirmPassword) {
            const response = await locals.supabase.auth.signUp({email, password, options: {emailRedirectTo: `${rootUrl}/auth/validate`}});

            if (response.data.user) {
                return {email, success: true};
            }
            return fail(400, {email, failed: true, message: response.error?.message ?? 'failed to register'});
        }
        return fail(400, {email, invalid: true});
    },
};
