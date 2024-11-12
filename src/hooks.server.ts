import {createDb} from '$lib/supabase/db.server';
import {createSupabase} from '$lib/supabase/supabase.server';
import {supabaseApiUrl, supabaseServiceRoleKey} from '$lib/core/env/env.server';

const db = createDb();

export const handle = async ({event, resolve}) => {
    const {getUser, supabase} = createSupabase({url: supabaseApiUrl, key: supabaseServiceRoleKey, cookies: event.cookies});

    event.locals.db = db;
    event.locals.user = getUser;
    event.locals.supabase = supabase;
    return await resolve(event);
};
