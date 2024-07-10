import {json, error} from '@sveltejs/kit';

import {valid} from '$lib/schema/validate';
import {graphSchema} from '$lib/core/core';
import type {JsonSchema} from '$lib/schema/schema';
import type {TriggerNode} from '$lib/core/graph/nodes';

import type {ProjectsId} from '$lib/supabase/gen/public/Projects';
import type {TriggersNodeId, TriggersPluginId} from '$lib/supabase/gen/public/Triggers';

const patchSchema = {
    type: 'object',
    required: ['image', 'content'] as const,
    properties: {
        image: {type: 'string'},
        content: graphSchema,
    },
} satisfies JsonSchema;

export const PATCH = async ({locals, params, request}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const body = await request.json();
    if (!valid(body, patchSchema)) throw error(400);

    const triggerNodes = body.content.nodes.filter(n => n.type === 'trigger') as TriggerNode[];
    const triggerNodeIds = triggerNodes.map(n => n.id as TriggersNodeId);

    await locals.db.transaction().execute(async trx => {
        await trx
            .deleteFrom('triggers')
            .where('node_id', 'not in', triggerNodeIds)
            .where('project_id', '=', params.id as ProjectsId)
            .execute();
        await Promise.all(
            triggerNodes.map(triggerNode => {
                return trx
                    .insertInto('triggers')
                    .values({
                        node_id: triggerNode.id as TriggersNodeId,
                        plugin_id: triggerNode.data.id as TriggersPluginId,
                        project_id: params.id as ProjectsId,
                        //
                        config: triggerNode.data.data.config,
                    })
                    .onConflict(oc =>
                        oc.constraint('public_triggers_pkey').doUpdateSet({
                            config: triggerNode.data.data.config,
                            updated_at: new Date(),
                        }),
                    )
                    .execute();
            }),
        );
    });

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
