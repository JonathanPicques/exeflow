import {error} from '@sveltejs/kit';

export const DELETE = async ({locals, params}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const {numDeletedRows} = await locals.db
        //
        .deleteFrom('public.secrets')
        .where('key', '=', params.key)
        .where('owner_id', '=', user.id)
        .executeTakeFirst();
    if (numDeletedRows < 1) throw error(500);

    return new Response(null, {status: 200});
};
