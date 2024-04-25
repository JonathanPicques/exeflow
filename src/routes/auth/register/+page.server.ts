import {fail} from '@sveltejs/kit';

export const actions = {
    default: async ({locals, request}) => {
        const form = await request.formData();
        const email = form.get('email') as string;
        const password = form.get('password') as string;
        const confirmPassword = form.get('confirmPassword') as string;

        if (email && password && confirmPassword && password === confirmPassword) {
            const result = await locals.supabase.auth.signUp({email, password, options: {emailRedirectTo: 'http://localhost:5173/auth/validate'}});

            if (result.data.user) {
                return {email, success: true};
            }
            return fail(400, {email, failed: true, message: result.error?.message ?? 'failed to register'});
        }
        return fail(400, {email, invalid: true});
    },
};
