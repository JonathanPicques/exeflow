import {json, error} from '@sveltejs/kit';

export const GET = async ({locals, params}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const project = await locals.db.selectFrom('public.projects').select('id').where('id', '=', params.id).where('owner_id', '=', user.id).limit(1).executeTakeFirst();
    if (!project) throw error(404);

    const logs = await locals.db
        .selectFrom('public.logs')
        .select(['config', 'results', 'plugin_id', 'created_at'])
        .where('exec_id', '=', params.exec_id)
        .where('project_id', '=', params.id)
        .orderBy('created_at desc')
        .execute();

    return json(
        logs.map(({plugin_id, config, results, created_at}) => ({
            config,
            results,
            pluginId: plugin_id,
            createdAt: created_at,
        })),
    );
};

export const DELETE = async ({locals, params}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const project = await locals.db.selectFrom('public.projects').select('id').where('id', '=', params.id).where('owner_id', '=', user.id).limit(1).executeTakeFirst();
    if (!project) throw error(404);

    const {numDeletedRows} = await locals.db.deleteFrom('public.logs').where('exec_id', '=', params.exec_id).where('project_id', '=', params.id).executeTakeFirst();
    if (numDeletedRows < 1) throw error(500);

    return new Response(null, {status: 200});
};
