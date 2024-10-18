import {db} from '$lib/supabase/db.server';
import {supabase} from '$lib/supabase/supabase.server';
import {supabaseApiUrl, supabaseServiceRoleKey} from '$lib/core/conf.server';

export const handle = async ({event, resolve}) => {
    event.locals.db = db();
    event.locals.supabase = supabase(supabaseApiUrl, supabaseServiceRoleKey, event.cookies);

    event.locals.user = async () => {
        const response = await event.locals.supabase.auth.getUser();
        return response.data.user ?? undefined;
    };

    return await resolve(event);
};
