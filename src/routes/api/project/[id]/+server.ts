import {z} from 'zod';
import {sql} from 'kysely';
import {json, error} from '@sveltejs/kit';

import {parseBody} from '$lib/core/helper/body';
import {graphSchema} from '$lib/core/core';
import {triggerRootUrl} from '$lib/core/env/env.server';
import type {Db} from '$lib/supabase/db.server';
import type {TriggerNode} from '$lib/core/core';

const patchSchema = z.object({
    name: z.string(),
    image: z.string(),
    content: graphSchema,
});

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

    const body = await parseBody(request, patchSchema);
    if (body.error) throw error(400, body.error.message);

    const project = await locals.db.selectFrom('public.projects').select('id').where('id', '=', params.id).where('owner_id', '=', user.id).limit(1).executeTakeFirst();
    if (!project) throw error(404);

    await locals.db.transaction().execute(async trx => {
        const triggerNodes = body.data.content.nodes.filter(n => n.type === 'trigger') as TriggerNode[];
        const triggerNodeIds = triggerNodes.map(n => n.id);

        const deleteTriggers = trx.deleteFrom('public.triggers').returning(['node_id', 'plugin_id', 'project_id']).where('project_id', '=', params.id);
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
                    .insertInto('public.triggers')
                    .returning(['node_id', 'plugin_id', 'project_id'])
                    .values({
                        node_id: triggerNode.id,
                        plugin_id: triggerNode.data.id,
                        project_id: params.id,
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

                    if (z.string().safeParse(cron).success) {
                        const {node_id, plugin_id, project_id} = newTrigger;

                        await schedule({trx, cron, node_id, plugin_id, project_id});
                    }
                }
            }),
        );

        const {numUpdatedRows} = await trx
            .updateTable('public.projects')
            .where('id', '=', params.id)
            .where('owner_id', '=', user.id)
            .set({
                name: body.data.name,
                image: body.data.image,
                content: JSON.stringify(body.data.content),
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

    const project = await locals.db.selectFrom('public.projects').select('id').where('id', '=', params.id).where('owner_id', '=', user.id).limit(1).executeTakeFirst();
    if (!project) throw error(404);

    await locals.db.transaction().execute(async trx => {
        const triggersDeleted = await trx.deleteFrom('public.triggers').returning(['node_id', 'plugin_id', 'project_id']).where('project_id', '=', params.id).execute();

        await Promise.all(
            triggersDeleted
                .filter(trigger => trigger.plugin_id === 'cron:cron')
                .map(async ({node_id, plugin_id, project_id}) => {
                    await unschedule({trx, node_id, plugin_id, project_id});
                }),
        );

        const {numDeletedRows} = await trx.deleteFrom('public.projects').where('id', '=', params.id).where('owner_id', '=', user.id).executeTakeFirst();
        if (numDeletedRows < 1) throw error(500);
    });

    return new Response(null, {status: 200});
};
