import {error} from '@sveltejs/kit';

import type {Project} from '../../api/project/project';

export const load = async ({locals, params, parent, request}) => {
    const {user} = await parent();
    if (!user) throw error(401);

    const project = (await locals.db
        .selectFrom('public.projects')
        .select(['id', 'name', 'image', 'content', 'created_at', 'updated_at'])
        .where('id', '=', params.id)
        .where('owner_id', '=', user.id)
        .limit(1)
        .executeTakeFirst()) as Project | undefined;
    if (!project) throw error(404);

    const secrets = await locals.db
        //
        .selectFrom('public.secrets')
        .select(['key', 'value'])
        .where('owner_id', '=', user.id)
        .execute();

    const userAgent = request.headers.get('user-agent') ?? '';
    return {project, secrets, mobileHint: userAgent.includes('iPhone') || userAgent.includes('Android')};
};
