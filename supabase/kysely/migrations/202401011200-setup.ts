import {sql} from 'kysely';
import type {Kysely} from 'kysely';

export const up = async (db: Kysely<unknown>) => {
    await db.executeQuery(sql`create extension if not exists pg_net with schema extensions;`.compile(db));
    await db.executeQuery(sql`create extension if not exists pg_cron with schema extensions;`.compile(db));

    await db.schema
        .createTable('public.projects')
        .ifNotExists()
        .addColumn('id', 'bigint', col => col.generatedAlwaysAsIdentity().primaryKey())
        .addColumn('name', 'text', col => col.notNull())
        .addColumn('image', 'text', col => col.notNull().defaultTo('data:null'))
        .addColumn('content', 'jsonb')
        .addColumn('owner_id', 'uuid', col => col.notNull())
        .addColumn('created_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
        .addColumn('updated_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
        .addForeignKeyConstraint('public_projects_owner_id_fkey', ['owner_id'], 'auth.users', ['id'], cb => cb.onDelete('cascade'))
        .execute();
    await db.executeQuery(sql`alter table public.projects enable row level security;`.compile(db));

    await db.schema
        .createTable('public.logs')
        .ifNotExists()
        .addColumn('exec_id', 'uuid', col => col.notNull())
        .addColumn('node_id', 'text', col => col.notNull())
        .addColumn('plugin_id', 'text', col => col.notNull())
        .addColumn('project_id', 'bigint', col => col.notNull())
        .addColumn('out', 'text')
        .addColumn('index', 'int4', col => col.notNull())
        .addColumn('config', 'jsonb')
        .addColumn('results', 'jsonb')
        .addColumn('created_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
        .addForeignKeyConstraint('public_logs_project_id_fkey', ['project_id'], 'public.projects', ['id'], cb => cb.onDelete('cascade'))
        .execute();
    await db.executeQuery(sql`alter table public.logs enable row level security;`.compile(db));

    await db.schema
        .createTable('public.secrets')
        .ifNotExists()
        .addColumn('key', 'text', col => col.notNull())
        .addColumn('value', 'text', col => col.notNull())
        .addColumn('owner_id', 'uuid', col => col.notNull())
        .addColumn('created_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
        .addColumn('updated_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
        .addCheckConstraint('public_secrets_key_not_empty_check', sql`trim(key) <> ''`)
        .addPrimaryKeyConstraint('public_secrets_pkey', ['key', 'owner_id'])
        .addForeignKeyConstraint('public_secrets_owner_id_fkey', ['owner_id'], 'auth.users', ['id'], cb => cb.onDelete('cascade'))
        .execute();
    await db.executeQuery(sql`alter table public.secrets enable row level security;`.compile(db));

    await db.schema
        .createTable('public.triggers')
        .ifNotExists()
        .addColumn('node_id', 'text', col => col.notNull())
        .addColumn('plugin_id', 'text', col => col.notNull())
        .addColumn('project_id', 'bigint', col => col.notNull())
        .addColumn('config', 'jsonb')
        .addColumn('created_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
        .addColumn('updated_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
        .addPrimaryKeyConstraint('public_triggers_pkey', ['node_id', 'plugin_id', 'project_id'])
        .addForeignKeyConstraint('public_triggers_project_id_fkey', ['project_id'], 'public.projects', ['id'], cb => cb.onDelete('cascade'))
        .execute();
    await db.executeQuery(sql`alter table public.triggers enable row level security;`.compile(db));
};

export const down = async (db: Kysely<unknown>) => {
    await db.schema.dropTable('public.triggers').ifExists().execute();
    await db.schema.dropTable('public.secrets').ifExists().execute();
    await db.schema.dropTable('public.logs').ifExists().execute();
    await db.schema.dropTable('public.projects').ifExists().execute();

    await db.executeQuery(sql`drop extension if exists pg_cron cascade;`.compile(db));
    await db.executeQuery(sql`drop extension if exists pg_net cascade;`.compile(db));
};
