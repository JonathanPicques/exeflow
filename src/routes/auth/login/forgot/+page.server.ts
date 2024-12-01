import {fail, redirect} from '@sveltejs/kit';

import {rootUrl} from '$lib/core/env/env.server';
import {inboxFromEmail} from '$lib/core/helper/inbox';

export const load = async ({locals}) => {
    const user = await locals.user();
    if (user) throw redirect(302, '/home');
};

export const actions = {
    default: async ({locals, request}) => {
        const form = await request.formData();
        const email = form.get('email') as string;

        const resetResponse = await locals.supabase.auth.resetPasswordForEmail(email, {redirectTo: `${rootUrl}/auth/login/forgot/reset`});
        if (resetResponse.error) {
            return fail(resetResponse.error.status ?? 500, {email, error: {message: resetResponse.error.message}});
        }
        return {email, success: {inbox: inboxFromEmail(email)}};
    },
};
