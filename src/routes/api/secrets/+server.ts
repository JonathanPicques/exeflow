import {json, error} from '@sveltejs/kit';

import {valid} from '$lib/schema/validate';
import type {JsonSchema} from '$lib/schema/schema';

export const GET = async ({locals}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const secrets = await locals.db
        //
        .selectFrom('secrets')
        .select(['key', 'value'])
        .where('owner_id', '=', user.id)
        .execute();
    return json(secrets);
};

const putSchema = {
    type: 'object',
    required: ['key', 'value'] as const,
    properties: {
        key: {type: 'string', minLength: 1},
        value: {type: 'string'},
    },
} satisfies JsonSchema;

export const PUT = async ({locals, request}) => {
    const user = await locals.user();
    if (!user) throw error(401);

    const body = await request.json();
    if (!valid(body, putSchema)) throw error(400);

    const secret = await locals.db
        .insertInto('secrets')
        .values({
            key: body.key,
            value: body.value,
            owner_id: user.id,
        })
        .returning(['key', 'value'])
        .onConflict(oc =>
            oc.constraint('public_secrets_pkey').doUpdateSet({
                value: body.value,
                updated_at: new Date(),
            }),
        )
        .executeTakeFirst();
    if (!secret) throw error(500);

    return json(secret);
};
