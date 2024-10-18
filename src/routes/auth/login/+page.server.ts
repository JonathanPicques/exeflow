import {fail, redirect} from '@sveltejs/kit';

export const load = async ({locals}) => {
    const user = await locals.user();
    if (user) throw redirect(302, '/home');
};

export const actions = {
    default: async ({locals, request}) => {
        const form = await request.formData();
        const email = form.get('email') as string;
        const password = form.get('password') as string;

        if (email && password) {
            const response = await locals.supabase.auth.signInWithPassword({email, password});

            if (response.data.user) {
                throw redirect(302, '/home');
            }
            return fail(403, {email, failed: true, message: response.error?.message ?? 'login failed'});
        }
        return fail(400, {email, invalid: true});
    },
};
