import type {InferJsonSchema, JsonSchema} from '$lib/schema/schema';

const envRegex = /\${env:([a-zA-Z0-9_-]+)}/gm;
const nodeRegex = /\${node:([a-zA-Z0-9_-]+):([a-zA-Z0-9_-]+)}/gm;

interface Variables {
    env: Record<string, string>;
    node: Record<string, Record<string, unknown>>;
}

/**
 * Returns the given value by replacing all its interpolations
 * @examples
 * ```ts
 * resolve('Hello ${env:USER}', {type: 'string'}, {env: {USER: 'jonathan'}}) => 'Hello jonathan'
 * resolve('Hello ${node:nodeid:user}', {type: 'string'}, {node: {nodeid: {user: 'jonathan'}}}) => 'Hello jonathan'
 * resolve({greeting: 'Hello ${env:USER}'}, {type: 'object', properties: {greeting: {type: 'string'}}}, {env: {USER: 'jonathan'}}) => ({greeting: 'Hello jonathan'})
 * ```
 */
export const resolve = <T extends JsonSchema>(value: InferJsonSchema<T>, schema: T, variables: Variables): InferJsonSchema<T> => {
    switch (schema.type) {
        case 'string':
            return evaluate(value, variables) as InferJsonSchema<T>;
        case 'number':
            if (typeof value === 'string') {
                return parseFloat(evaluate(value, variables)) as InferJsonSchema<T>;
            }
            return value;
        case 'boolean':
            if (typeof value === 'string') {
                return new Boolean(evaluate(value, variables)).valueOf() as InferJsonSchema<T>;
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
 * ```
 */
export const constant = (value: unknown): boolean => {
    switch (typeof value) {
        case 'string':
            return !value.includes('${env:') && !value.includes('${node:');
        case 'number':
        case 'boolean':
            return true;
    }
    throw new Error(`constant not yet implemented for ${value} of type ${typeof value}`);
};

const evaluate = (str: string, variables: Variables): string => {
    return str
        .replace(envRegex, match => {
            const name = match.substring(6, match.length - 1); // extract NAME from ${env:NAME}
            if (name.startsWith('EXEFLOW_')) {
                console.error(`${match} is a reserved env variable`);
                return '';
            }
            return variables.env[name] ?? '';
        })
        .replaceAll(nodeRegex, match => {
            const [nodeId, result] = match.substring(7, match.length - 1).split(':'); // extract NODE_ID:RESULT from ${node:NODE_ID:RESULT}
            return (variables.node[nodeId]?.[result] as string) ?? '';
        });
};
