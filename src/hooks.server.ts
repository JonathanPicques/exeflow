import {error, type Handle} from '@sveltejs/kit';

import {supabase} from '$lib/supabase/client.server';
import {supabaseUserToAuthUser} from '$lib/api/user';
import {SUPABASE_API_URL, SUPABASE_SERVICE_ROLE_KEY} from '$env/static/private';

export const handle: Handle = async ({event, resolve}) => {
    event.locals.user = async () => {
        const userResult = await event.locals.supabase.auth.getUser();
        if (userResult.data.user) return supabaseUserToAuthUser(userResult.data.user);

        const anonResult = await event.locals.supabase.auth.signInAnonymously();
        if (anonResult.data.user) return supabaseUserToAuthUser(anonResult.data.user);

        throw error(500, anonResult.error?.message ?? 'signing in anonymously failed');
    };
    event.locals.migrateAnon = async (anonUser, signInUser) => {
        console.log(`TODO: migrate all data that belonged to the anon user (${anonUser.id}) to the user that logged in (${signInUser.email})`);

        await event.locals.supabase.auth.admin.deleteUser(anonUser.id);
    };
    event.locals.supabase = supabase(SUPABASE_API_URL, SUPABASE_SERVICE_ROLE_KEY, event.cookies);

    return await resolve(event);
};
