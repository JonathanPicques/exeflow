import {fail, redirect} from '@sveltejs/kit';

export async function load({locals}) {
    if (await locals.user()) {
        throw redirect(303, '/');
    }
}

export const actions = {
    default: async ({locals, request}) => {
        const form = await request.formData();
        const email = form.get('email') as string;
        const password = form.get('password') as string;

        if (email && password) {
            const result = await locals.supabase.auth.signInWithPassword({email, password});

            if (result.data.user) {
                throw redirect(303, '/');
            }
            return fail(403, {email, failed: true, message: result.error?.message ?? 'login failed'});
        }
        return fail(400, {email, invalid: true});
    },
};
