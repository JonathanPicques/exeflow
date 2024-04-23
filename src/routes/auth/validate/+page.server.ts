import {fail} from '@sveltejs/kit';

export const actions = {
    default: async ({locals, request}) => {
        const form = await request.formData();
        const password = form.get('password') as string;
        const confirmPassword = form.get('confirmPassword') as string;

        if (password && confirmPassword && password === confirmPassword) {
            const result = await locals.supabase.auth.updateUser({password});

            if (result.data.user) {
                return {error: undefined, success: true};
            }
            return fail(400, {failed: true, message: result.error?.message ?? 'failed to update password'});
        }
        return fail(400, {invalid: true});
    },
};
