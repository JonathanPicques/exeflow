import Pg from 'pg';
import {Kysely, PostgresDialect} from 'kysely';

import {EXEFLOW_SUPABASE_DB_URL} from '$env/static/private';
import type {Database} from './gen/Database';

export type Db = Kysely<Database>;

const dialect = new PostgresDialect({
    pool: new Pg.Pool({
        max: 10,
        connectionString: EXEFLOW_SUPABASE_DB_URL,
    }),
});

export const db = () => new Kysely<Database>({dialect});
