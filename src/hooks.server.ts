import {error, type Handle} from '@sveltejs/kit';

import {db} from '$lib/supabase/db.server';
import {supabase} from '$lib/supabase/supabase.server';
import {supabaseUserToAuthUser} from '$lib/supabase/user';
import {SUPABASE_API_URL, SUPABASE_SERVICE_ROLE_KEY} from '$env/static/private';

export const handle: Handle = async ({event, resolve}) => {
    event.locals.db = db();
    event.locals.supabase = supabase(SUPABASE_API_URL, SUPABASE_SERVICE_ROLE_KEY, event.cookies);

    event.locals.user = async () => {
        const userResult = await event.locals.supabase.auth.getUser();
        if (userResult.data.user) return supabaseUserToAuthUser(userResult.data.user);
    };

    return await resolve(event);
};
