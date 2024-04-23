import {fail, redirect} from '@sveltejs/kit';

export async function load({locals}) {
    const user = await locals.supabase.auth.getUser();

    if (user.data.user && !user.data.user.is_anonymous) {
        throw redirect(303, '/');
    }
}

export const actions = {
    default: async ({locals, request}) => {
        const form = await request.formData();
        const email = form.get('email') as string;
        const password = form.get('password') as string;

        if (email && password) {
            const anonResult = await locals.supabase.auth.getUser();
            const signInResult = await locals.supabase.auth.signInWithPassword({email, password});

            if (signInResult.data.user) {
                if (anonResult.data.user && anonResult.data.user.is_anonymous) {
                    /* await */ locals.migrateAnon(anonResult.data.user, signInResult.data.user);
                }
                throw redirect(303, '/');
            }
            return fail(403, {email, failed: true, message: signInResult.error?.message ?? ''});
        }
        return fail(400, {email, invalid: true});
    },
};
