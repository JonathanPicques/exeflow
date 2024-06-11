import {db} from '$lib/supabase/db.server';
import {supabase} from '$lib/supabase/supabase.server';
import {EXEFLOW_SUPABASE_API_URL, EXEFLOW_SUPABASE_SERVICE_ROLE_KEY} from '$env/static/private';

export const handle = async ({event, resolve}) => {
    event.locals.db = db();
    event.locals.supabase = supabase(EXEFLOW_SUPABASE_API_URL, EXEFLOW_SUPABASE_SERVICE_ROLE_KEY, event.cookies);

    event.locals.user = async () => {
        const userResult = await event.locals.supabase.auth.getUser();
        return userResult.data.user ?? undefined;
    };

    return await resolve(event);
};
