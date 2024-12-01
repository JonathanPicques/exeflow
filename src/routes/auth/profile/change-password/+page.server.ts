import {fail} from '@sveltejs/kit';

export const actions = {
    default: async ({locals, request}) => {
        const form = await request.formData();
        const password = form.get('password') as string;
        const confirmPassword = form.get('confirmPassword') as string;

        if (password && confirmPassword && password === confirmPassword) {
            const response = await locals.supabase.auth.updateUser({password});

            if (response.data.user) {
                return {success: {}};
            }
            return fail(response.error?.status ?? 500, {error: {message: response.error?.message ?? 'failed to change password'}});
        }
        return fail(400, {error: {message: 'password and confirm password do not match'}});
    },
};
