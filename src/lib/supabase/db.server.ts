import Pg from 'pg';
import {Kysely, PostgresDialect} from 'kysely';

import {supabaseDbUrl} from '$lib/core/conf.server';
import type {Database} from './gen/Database';

export type Db = Kysely<Database>;

const dialect = new PostgresDialect({
    pool: new Pg.Pool({
        max: 10,
        connectionString: supabaseDbUrl,
    }),
});

export const db = () => new Kysely<Database>({dialect});
