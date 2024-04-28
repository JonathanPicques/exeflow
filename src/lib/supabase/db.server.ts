import Pg from 'pg';
import {SUPABASE_DB_URL} from '$env/static/private';
import {Kysely, PostgresDialect} from 'kysely';
import type {DB} from './db.server.types';

export type Db = Kysely<DB>;

const dialect = new PostgresDialect({
    pool: new Pg.Pool({
        max: 10,
        connectionString: SUPABASE_DB_URL,
    }),
});

export const db = () => new Kysely<DB>({dialect});
