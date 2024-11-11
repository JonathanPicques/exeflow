import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import {pathToFileURL} from 'url';
import {Kysely, Migrator, PostgresDialect} from 'kysely';
import type {Migration, MigrationResult} from 'kysely';

dotenv.config();

const defaultMigrationContent = `import {sql} from 'kysely';
import type {Kysely} from 'kysely'

export const up = async (db: Kysely<unknown>) => {
    await db.executeQuery(sql\`create extension if not exists pg_net with schema extensions;\`.compile(db));
};

export const down = async (db: Kysely<unknown>) => {
    await db.executeQuery(sql\`drop extension if exists pg_net cascade;\`.compile(db));
};
`;

type MigrateOperation = 'up' | 'down' | 'latest';
type CommandOperation = MigrateOperation | 'new';

const migrationFolder = './supabase/kysely/migrations';

const operation = process.argv[2] as CommandOperation | undefined;
if (!operation) {
    console.error(`need an operation to execute, command expected: "up", "down", "latest" or "new"`);
    process.exit(1);
}

const migrate = async () => {
    const db = new Kysely<any>({
        dialect: new PostgresDialect({
            pool: new pg.Pool({
                connectionString: process.env.EXEFLOW_SUPABASE_DB_URL,
            }),
        }),
    });

    const migrator = new Migrator({
        db,
        provider: {
            async getMigrations() {
                const files = await fs.readdir(migrationFolder);
                const migrations: Record<string, Migration> = {};

                for (const fileName of files) {
                    const url = pathToFileURL(path.resolve(path.posix.join(migrationFolder, fileName)));
                    const migration = await import(url.toString());
                    const migrationKey = fileName.substring(0, fileName.lastIndexOf('.'));
                    const migrationDefault = migration?.default;

                    if (typeof migrationDefault === 'function' || (typeof migrationDefault === 'object' && migrationDefault !== null)) {
                        migrations[migrationKey] = migrationDefault;
                    } else if (typeof migration === 'function' || (typeof migration === 'object' && migration !== null)) {
                        migrations[migrationKey] = migration;
                    }
                }
                return migrations;
            },
        },
    });

    let error: unknown | undefined;
    let results: MigrationResult[] | undefined;

    switch (operation) {
        case 'up': {
            ({error, results} = await migrator.migrateUp());
            break;
        }
        case 'down': {
            ({error, results} = await migrator.migrateDown());
            break;
        }
        case 'latest': {
            ({error, results} = await migrator.migrateToLatest());

            break;
        }
    }
    results?.forEach(it => {
        if (it.status === 'Success' && it.direction === `Up`) {
            console.log(`${new Date().toISOString()} - migration "${it.migrationName}" was executed successfully`);
        } else if (it.status === 'Success' && it.direction === `Down`) {
            console.log(`${new Date().toISOString()} - migration "${it.migrationName}" was reverted successfully`);
        } else if (it.status === 'Error') {
            console.error(`${new Date().toISOString()} - failed to execute migration "${it.migrationName}"`);
        }
    });
    if (results?.length === 0 && operation !== 'down') {
        console.log(`${new Date().toISOString()} - Migrations are up to date`);
    } else if (results?.length === 0 && operation === 'down') {
        console.log(`${new Date().toISOString()} - No migration to rollback: database is in its initial state`);
    }
    await db.destroy();

    if (error) {
        console.error(`${new Date().toISOString()} - failed to migrate`);
        console.error(error);
        process.exit(1);
    }
};

const createNewMigration = async () => {
    const name = process.argv[3];
    if (!name) {
        console.error(`a name is required to create a new migration\nExample: pnpm kysely:migrate new add-products-table`);
        process.exit(1);
    }
    const date = new Date();
    const fileName = `${date.getUTCFullYear()}${(date.getUTCMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date
        .getHours()
        .toString()
        .padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}-${name}.ts`;
    await fs.writeFile(pathToFileURL(path.resolve(path.posix.join(migrationFolder, fileName))), defaultMigrationContent, {encoding: 'utf-8'});
    console.log(`migration file ${fileName} created`);
};

(async () => {
    switch (operation) {
        case 'new': {
            await createNewMigration();
            break;
        }
        default: {
            await migrate();
            break;
        }
    }
})();
