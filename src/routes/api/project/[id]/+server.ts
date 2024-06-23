import {json, error} from '@sveltejs/kit';

import {valid} from '$lib/schema/validate';
import type {ProjectsId} from '$lib/supabase/gen/public/Projects';
import type {JsonSchema} from '$lib/schema/schema.js';

const patchSchema = {
    type: 'object',
    required: ['image', 'content'] as const,
    properties: {
        image: {type: 'string'},
        content: {
            type: 'object',
            required: ['edges', 'nodes'] as const,
            properties: {edges: {}, nodes: {}},
        },
    },
} satisfies JsonSchema;

export const PATCH = async ({locals, params, request}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const body = await request.json();
    if (!valid(body, patchSchema)) throw error(400);

    const {numUpdatedRows} = await locals.db
        .updateTable('projects')
        .where('id', '=', params.id as ProjectsId)
        .where('owner_id', '=', user.id)
        .set({
            image: body.image,
            content: JSON.stringify(body.content),
            updated_at: new Date(),
        })
        .executeTakeFirst();
    if (numUpdatedRows < 1) throw error(500);

    return json({id: params.id});
};

export const DELETE = async ({locals, params}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const {numDeletedRows} = await locals.db
        .deleteFrom('projects')
        .where('id', '=', params.id as ProjectsId)
        .where('owner_id', '=', user.id)
        .executeTakeFirst();
    if (numDeletedRows < 1) throw error(500);

    return json({id: params.id});
};
