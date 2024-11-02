import {json, error} from '@sveltejs/kit';

import {valid} from '$lib/core/schema/validate';
import type {JsonSchema} from '$lib/core/schema/schema';

const postSchema = {
    type: 'object',
    required: ['name'] as const,
    properties: {
        name: {type: 'string'},
    },
} satisfies JsonSchema;

export const POST = async ({locals, request}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const body = await request.json();
    if (!valid(body, postSchema)) throw error(400);

    const project = await locals.db
        .insertInto('projects')
        .values({name: body.name, content: JSON.stringify({nodes: [], edges: []}), owner_id: user.id})
        .returning(['id', 'name', 'image', 'content'])
        .executeTakeFirst();
    if (!project) throw error(500);

    return json(project);
};
