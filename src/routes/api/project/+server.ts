import {z} from 'zod';
import {json, error} from '@sveltejs/kit';

import {parseBody} from '$lib/core/helper/body';

const postSchema = z.object({name: z.string()});

export const POST = async ({locals, request}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const body = await parseBody(request, postSchema);
    if (body.error) throw error(400, body.error.message);

    const project = await locals.db
        .insertInto('public.projects')
        .values({name: body.data.name, content: JSON.stringify({nodes: [], edges: []}), owner_id: user.id})
        .returning(['id', 'name', 'image', 'content'])
        .executeTakeFirst();
    if (!project) throw error(500);

    return json(project);
};
