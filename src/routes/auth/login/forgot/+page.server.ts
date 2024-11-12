import {fail, redirect} from '@sveltejs/kit';

import {rootUrl} from '$lib/core/env/env.server.js';

export const load = async ({locals}) => {
    const user = await locals.user();
    if (user) throw redirect(302, '/home');
};

export const actions = {
    default: async ({locals, request}) => {
        const form = await request.formData();
        const email = form.get('email') as string;

        const resetResponse = await locals.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${rootUrl}/auth/login/reset`,
        });
        if (resetResponse.error) {
            return fail(400, {email, sent: false, failed: true, message: resetResponse.error.message});
        }
        return fail(200, {email, sent: true, failed: false, message: ''});
    },
};
