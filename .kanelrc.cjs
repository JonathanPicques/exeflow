/* eslint-disable @typescript-eslint/no-require-imports */
const {sep} = require('path');
const dotenv = require('dotenv');
const {makeKyselyHook} = require('kanel-kysely');
const {resolveType, escapeIdentifier} = require('kanel');

const {customTypes} = require('./.kanelrc.json');

dotenv.config();

const tablesToIgnore = ['kysely_migration', 'kysely_migration_lock'];

/**
 * @param {import('kanel').Output} output
 */
const namedExportsHook = output => {
    for (const [, {declarations}] of Object.entries(output)) {
        for (const declaration of declarations) {
            declaration.exportAs = 'named';
            for (const typeImport of declaration.typeImports ?? []) {
                typeImport.isDefault = false;
                typeImport.importAsType = true;
            }
            for (const property of declaration.properties ?? []) {
                for (const typeImport of property.typeImports ?? []) {
                    typeImport.isDefault = false;
                }
            }
        }
    }
    return output;
};

/**
 * @param {import('kanel').Output} output
 */
const extractCustomJsonTypes = output => {
    for (const [path, type] of Object.entries(customTypes)) {
        const [schema, table, column] = path.split('.');

        for (const [filePath, {declarations}] of Object.entries(output)) {
            const split = filePath.split(sep);
            const typeName = `${schema}_${table}_${column}`;
            const [schemaName, tableName] = split.slice(-2);

            if (schemaName === schema && tableName === table) {
                declarations.splice(1, 0, {
                    name: typeName,
                    comment: [`Custom JSON type`],
                    exportAs: 'named',
                    typeDefinition: [type],
                    declarationType: 'typeDeclaration',
                });

                for (const declaration of declarations) {
                    for (const property of declaration.properties ?? []) {
                        if (property.name === column) {
                            property.typeName = property.typeName.replaceAll('unknown', typeName);
                        }
                    }
                }
            }
        }
    }
    return output;
};

module.exports = {
    schemas: ['auth', 'public'],
    connection: process.env.EXEFLOW_SUPABASE_DB_URL,

    typeFilter: type => type.kind === 'table' && !tablesToIgnore.includes(type.name),
    enumStyle: 'type',
    outputPath: './src/lib/supabase/gen',
    preDeleteOutputFolder: true,
    preRenderHooks: [makeKyselyHook({includeSchemaNameInTableName: true}), namedExportsHook, extractCustomJsonTypes],

    // removes branded types pk + prefix types with schema to avoid conflicts
    generateIdentifierType: (column, details, config) => {
        const name = escapeIdentifier(`${details.schemaName}${details.name}${column.name}`);
        const innerType = resolveType(column, details, {
            ...config,
            // Explicitly disable identifier resolution so we get the actual inner type here
            generateIdentifierType: undefined,
        });
        const imports = [];

        let type = innerType;
        if (typeof innerType === 'object') {
            // Handle non-primitives
            type = innerType.name;
            imports.push(...innerType.typeImports);
        }

        return {
            name,
            comment: [`Identifier type for ${details.schemaName}.${details.name}`],
            exportAs: 'named',
            typeImports: imports,
            typeDefinition: [type],
            declarationType: 'typeDeclaration',
        };
    },
    customTypeMap: {
        // 'pg_catalog.int8': 'number',
        'pg_catalog.bytea': 'string',
        'pg_catalog.tsvector': 'Set<string>',
    },
};
