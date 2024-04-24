import Pg from 'pg';
import {DATABASE_URL} from '$env/static/private';
import {Kysely, PostgresDialect} from 'kysely';
import type {DB} from './db.server.types';

const dialect = new PostgresDialect({
    pool: new Pg.Pool({
        max: 10,
        connectionString: DATABASE_URL,
    }),
});

export const db = () => {
    return new Kysely<DB>({
        dialect,
    });
};
