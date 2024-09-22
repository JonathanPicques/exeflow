import {valid} from '$lib/schema/validate';
import type {InferJsonSchema} from '$lib/schema/infer';
import type {JsonSchema, JsonSchemaAnyOf} from '$lib/schema/schema';

const nodeRegex = /\${node:([a-zA-Z0-9_-]+):([a-zA-Z0-9_-]+)(:(\S*))?}/gm;
const secretsRegex = /\${secret:([a-zA-Z0-9_-]+)}/gm;

interface Variables {
    node: Record<string, Record<string, unknown>>;
    secrets: Record<string, string>;
}

/**
 * Returns a property by path
 * @examples
 * ```ts
 * access({hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}}, 'hero') => {name: 'Zorro'}
 * access({hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}}, 'hero.name') => 'Zorro'
 * access({hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}}, 'hero.friends.1') => 'Garcia'
 * ```
 */
export const access = (obj: any, path: string): unknown => {
    for (const p of path.split('.')) {
        if (!obj || !obj.hasOwnProperty(p)) return undefined;
        obj = obj[p];
    }
    return obj;
};

/**
 * Returns the given value by replacing all its interpolations
 * @examples
 * ```ts
 * resolve('Hello ${secret:USER}', {type: 'string'}, {secret: {USER: 'jonathan'}}) => 'Hello jonathan'
 * resolve('Hello ${node:nodeid:user}', {type: 'string'}, {node: {nodeid: {user: 'jonathan'}}}) => 'Hello jonathan'
 * resolve({greeting: 'Hello ${secret:USER}'}, {type: 'object', properties: {greeting: {type: 'string'}}}, {secret: {USER: 'jonathan'}}) => ({greeting: 'Hello jonathan'})
 * ```
 */
export const resolve = <T extends JsonSchema>(value: InferJsonSchema<T>, schema: T, variables: Variables): InferJsonSchema<T> => {
    switch (schema.type) {
        case undefined: {
            if ((schema as JsonSchemaAnyOf).anyOf !== undefined) {
                for (const subschema of (schema as JsonSchemaAnyOf).anyOf) {
                    if (valid(value, subschema)) {
                        return resolve(value, subschema, variables);
                    }
                }
            }
            return value as InferJsonSchema<T>;
        }
        case 'array': {
            if (schema.items) {
                return (value as unknown[]).map(item => resolve(item, schema.items!, variables)) as InferJsonSchema<T>;
            }
        }
        case 'string':
            return evaluate(value, variables) as InferJsonSchema<T>;
        case 'number':
            if (typeof value === 'string') {
                return parseFloat(evaluate(value, variables)) as InferJsonSchema<T>;
            }
            return value;
        case 'boolean':
            if (typeof value === 'string') {
                switch (evaluate(value, variables)) {
                    case 'true':
                    case 'True':
                    case 'TRUE':
                        return true as InferJsonSchema<T>;
                    default:
                        return false as InferJsonSchema<T>;
                }
            }
            return value;
        case 'object': {
            return Object.keys(schema.properties ?? {}).reduce((obj, key) => {
                return {...obj, [key]: resolve(value[key], schema.properties![key], variables)};
            }, {} as InferJsonSchema<T>);
        }
    }
    throw new Error(`resolve not yet implemented for ${value} of type ${typeof value} with schema ${JSON.stringify(schema)}`);
};

/**
 * Returns whether the given value is constant (no interpolation)
 * @examples
 * ```ts
 * constant('sk-123') => true
 * constant('sk-123-${env:SK_SUFFIX}') => false
 * constant('Hello ${node:1234:user.name}!') => false
 * constant('api key: ${secret:MISTRAL_API_KEY}!') => false
 * ```
 */
export const constant = (value: unknown): boolean => {
    switch (typeof value) {
        case 'string':
            return !value.includes('${env:') && !value.includes('${node:') && !value.includes('${secret:');
        case 'number':
        case 'boolean':
            return true;
    }
    throw new Error(`constant not yet implemented for ${value} of type ${typeof value}`);
};

const evaluate = (str: string, variables: Variables): string => {
    return str
        .replace(secretsRegex, match => {
            const name = match.substring(9, match.length - 1); // extract NAME from ${secret:NAME}
            return variables.secrets[name] ?? '';
        })
        .replaceAll(nodeRegex, match => {
            const [nodeId, result, path] = match.substring(7, match.length - 1).split(':'); // extract NODE_ID:RESULT:PATH from ${node:NODE_ID:RESULT:PATH}
            if (path) {
                return (access(variables.node[nodeId]?.[result], path) as string) ?? '';
            }
            return (variables.node[nodeId]?.[result] as string) ?? '';
        });
};
