import pg from 'pg';

import {serverAction} from '$lib/core/plugins/action.server';
import type action from './query';

export default serverAction<typeof action>({
    exec: async function* ({next, config}) {
        const {query, connection} = config;

        const client = new pg.Client({connectionString: connection});
        await client.connect();
        const result = await client.query(query);

        yield* next({
            output: 'out',
            results: {
                count: result.rowCount ?? result.rows.length,
                result: result.rows,
            },
        });
    },
});
