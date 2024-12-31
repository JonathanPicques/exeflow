import {z} from 'zod';
import {json, error} from '@sveltejs/kit';

import {parseBody} from '$lib/core/helper/body';

export const GET = async ({locals}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const secrets = await locals.db
        //
        .selectFrom('public.secrets')
        .select(['key', 'value'])
        .where('owner_id', '=', user.id)
        .execute();
    return json(secrets);
};

const putSchema = z.object({
    key: z.string().trim().min(1),
    value: z.string().trim(),
});

export const PUT = async ({locals, request}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const body = await parseBody(request, putSchema);
    if (body.error) throw error(400, body.error.message);

    const secret = await locals.db
        .insertInto('public.secrets')
        .values({
            key: body.data.key,
            value: body.data.value,
            owner_id: user.id,
        })
        .returning(['key', 'value'])
        .onConflict(oc =>
            oc.constraint('public_secrets_pkey').doUpdateSet({
                value: body.data.value,
                updated_at: new Date(),
            }),
        )
        .executeTakeFirst();
    if (!secret) throw error(500);

    return json(secret);
};
