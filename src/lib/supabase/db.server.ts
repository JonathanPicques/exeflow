import pg from 'pg';
import {Kysely, PostgresDialect} from 'kysely';

import {supabaseDbUrl} from '$lib/core/env/env.server';
import type {Database} from './gen/Database';

export type Db = Kysely<Database>;

const parseDate = (value: string) => (value === null ? null : new Date(value));
pg.types.setTypeParser(pg.types.builtins.DATE, parseDate);
pg.types.setTypeParser(pg.types.builtins.TIME, parseDate);
pg.types.setTypeParser(pg.types.builtins.TIMETZ, parseDate);
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, parseDate);
pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, parseDate);

const dialect = new PostgresDialect({
    pool: new pg.Pool({
        max: 10,
        connectionString: supabaseDbUrl,
    }),
});

export const db = () => new Kysely<Database>({dialect});
