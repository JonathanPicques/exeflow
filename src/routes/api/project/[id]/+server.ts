import {sql} from 'kysely';
import {json, error} from '@sveltejs/kit';

import {valid} from '$lib/schema/validate';
import {graphSchema} from '$lib/core/core';
import {triggerRootUrl} from '$lib/core/conf.server';
import type {Db} from '$lib/supabase/db.server';
import type {JsonSchema} from '$lib/schema/schema';
import type {TriggerNode} from '$lib/core/core';

import type {ProjectsId} from '$lib/supabase/gen/public/Projects';
import type {TriggersNodeId, TriggersPluginId} from '$lib/supabase/gen/public/Triggers';

const patchSchema = {
    type: 'object',
    required: ['name', 'image', 'content'] as const,
    properties: {
        name: {type: 'string'},
        image: {type: 'string'},
        content: graphSchema,
    },
} satisfies JsonSchema;

const jobname = ({node_id, plugin_id, project_id}: {node_id: string; plugin_id: string; project_id: string}) => {
    return `${project_id}:${plugin_id}:${node_id}`;
};
const schedule = async ({trx, cron, node_id, plugin_id, project_id}: {trx: Db; cron: string; node_id: string; plugin_id: string; project_id: string}) => {
    const triggerUrl = `${triggerRootUrl}/api/project/${project_id}/triggers/run/${node_id}`;

    await sql`select
      cron.schedule(
        ${jobname({node_id, plugin_id, project_id})},
        ${cron},
        $$
        select
          net.http_post(
              url:=${sql.lit(triggerUrl)},
              headers:='{"Content-Type": "application/json"}'::jsonb
          ) as request_id;
        $$
      );`.execute(trx);
};
const unschedule = async ({trx, node_id, plugin_id, project_id}: {trx: Db; node_id: string; plugin_id: string; project_id: string}) => {
    await sql`select cron.unschedule(${jobname({node_id, plugin_id, project_id})});`.execute(trx);
};

export const PATCH = async ({locals, params, request}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const project = await locals.db
        .selectFrom('projects')
        .select('id')
        .where('id', '=', params.id as ProjectsId)
        .where('owner_id', '=', user.id)
        .limit(1)
        .executeTakeFirst();
    if (!project) throw error(404);

    const body = await request.json();
    if (!valid(body, patchSchema)) throw error(400);

    await locals.db.transaction().execute(async trx => {
        const triggerNodes = body.content.nodes.filter(n => n.type === 'trigger') as TriggerNode[];
        const triggerNodeIds = triggerNodes.map(n => n.id as TriggersNodeId);

        const deleteTriggers = trx
            .deleteFrom('triggers')
            .returning(['node_id', 'plugin_id', 'project_id'])
            .where('project_id', '=', params.id as ProjectsId);
        if (triggerNodeIds.length > 0) deleteTriggers.where('node_id', 'not in', triggerNodeIds);
        const triggersDeleted = await deleteTriggers.execute();

        await Promise.all(
            triggersDeleted
                .filter(trigger => trigger.plugin_id === 'cron:cron')
                .map(async ({node_id, plugin_id, project_id}) => {
                    await unschedule({trx, node_id, plugin_id, project_id});
                }),
        );

        await Promise.all(
            triggerNodes.map(async triggerNode => {
                const newTrigger = await trx
                    .insertInto('triggers')
                    .returning(['node_id', 'plugin_id', 'project_id'])
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
                    .executeTakeFirst();

                if (newTrigger?.plugin_id === 'cron:cron') {
                    const cron = triggerNode.data.data.config.value.interval;

                    if (valid(cron, {type: 'string'})) {
                        const {node_id, plugin_id, project_id} = newTrigger;

                        await schedule({trx, cron, node_id, plugin_id, project_id});
                    }
                }
            }),
        );

        const {numUpdatedRows} = await trx
            .updateTable('projects')
            .where('id', '=', params.id as ProjectsId)
            .where('owner_id', '=', user.id)
            .set({
                name: body.name,
                image: body.image,
                content: JSON.stringify(body.content),
                updated_at: new Date(),
            })
            .executeTakeFirst();
        if (numUpdatedRows < 1) throw error(500);
    });

    return json({id: params.id});
};

export const DELETE = async ({locals, params}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const project = await locals.db
        .selectFrom('projects')
        .select('id')
        .where('id', '=', params.id as ProjectsId)
        .where('owner_id', '=', user.id)
        .limit(1)
        .executeTakeFirst();
    if (!project) throw error(404);

    await locals.db.transaction().execute(async trx => {
        const triggersDeleted = await trx
            .deleteFrom('triggers')
            .returning(['node_id', 'plugin_id', 'project_id'])
            .where('project_id', '=', params.id as ProjectsId)
            .execute();

        await Promise.all(
            triggersDeleted
                .filter(trigger => trigger.plugin_id === 'cron:cron')
                .map(async ({node_id, plugin_id, project_id}) => {
                    await unschedule({trx, node_id, plugin_id, project_id});
                }),
        );

        const {numDeletedRows} = await trx
            .deleteFrom('projects')
            .where('id', '=', params.id as ProjectsId)
            .where('owner_id', '=', user.id)
            .executeTakeFirst();
        if (numDeletedRows < 1) throw error(500);
    });

    return new Response(null, {status: 200});
};
