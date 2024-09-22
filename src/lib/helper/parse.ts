import {valid} from '$lib/schema/validate';
import type {InferJsonSchema} from '$lib/schema/infer';
import type {JsonSchema, JsonSchemaAnyOf} from '$lib/schema/schema';

type Text = {type: 'text'; text: string};
type Node = {type: 'node'; id: string; path?: string; property: string};
type Secret = {type: 'secret'; name: string};
type Interpolation = Text | Node | Secret;

interface Variables {
    nodes: Record<string, Record<string, unknown>>;
    secrets: Record<string, string>;
}

const regex = /\${(node|secret):([a-zA-Z0-9_-]+)(:([\.a-zA-Z0-9_-]+))?(:([\.a-zA-Z0-9_-]+))?}/gm;

/**
 * Parses a string and returns an array of interpolations
 * @examples
 * ```ts
 * parse('Hello world') => [{type: 'text', text: 'Hello world'}]
 * parse('Hello ${secret:USER}!') => [{type: 'text', text: 'Hello '}, {type: 'secret', name: 'USER'}, {type: 'text', text: '!'}]
 * parse('${secret:USER} welcome!') => [{type: 'secret', name: 'USER'}, {type: 'text', text: ' welcome!'}]
 * ```
 */
export const parse = (str: string) => {
    let last = 0;
    const result: Interpolation[] = [];
    const matches = str.matchAll(regex);

    for (const match of matches) {
        const [, type] = match;

        switch (type) {
            case 'node': {
                const [, , id, , property, , path] = match;

                if (id && property) {
                    const text = str.substring(last, match.index);
                    if (text) result.push({type: 'text', text});
                    result.push({type, id, path, property});
                    last = match.index + match[0].length;
                }
                break;
            }
            case 'secret': {
                const [, , name] = match;

                if (name) {
                    const text = str.substring(last, match.index);
                    if (text) result.push({type: 'text', text});
                    result.push({type, name});
                    last = match.index + match[0].length;
                }
                break;
            }
        }
    }

    const lastText = str.substring(last);
    if (lastText !== '') {
        result.push({type: 'text', text: lastText});
    }

    return result;
};

/**
 * Returns a property by path
 * @examples
 * ```ts
 * access({hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}}, '') => {hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}}
 * access({hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}}, 'hero') => {name: 'Zorro', friends: ['Bernardo', 'Garcia']}
 * access({hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}}, 'hero.name') => 'Zorro'
 * access({hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}}, 'hero.friends.1') => 'Garcia'
 * ```
 */
export const access = (obj: any, path: string): unknown => {
    if (path === '') return obj;
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
 * resolve('Hello ${secret:USER}', {type: 'string'}, {secrets: {USER: 'jonathan'}}) => 'Hello jonathan'
 * resolve('Hello ${node:createUser:user}', {type: 'string'}, {nodes: {createUser: {user: 'jonathan'}}}) => 'Hello jonathan'
 * resolve({greeting: 'Hello ${secret:USER}'}, {type: 'object', properties: {greeting: {type: 'string'}}}, {secrets: {USER: 'jonathan'}}) => ({greeting: 'Hello jonathan'})
 * ```
 */
export const resolve = <T extends JsonSchema>(value: InferJsonSchema<T>, schema: T, variables: Partial<Variables>): InferJsonSchema<T> => {
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
        default: {
            throw new Error(`resolve not yet implemented for ${value} of type ${typeof value} with schema ${JSON.stringify(schema)}`);
        }
    }
};

/**
 * Returns whether the given value is constant (contains no dynamic interpolation)
 * @examples
 * ```ts
 * constant('Welcome!') => true
 * constant('Hello ${node:createUser:user:name}!') => false
 * constant('You API key: ${secret:MISTRAL_API_KEY}!') => false
 * constant('You API key: ${secret:MISTRAL_API_KEY### !') => true
 * ```
 */
export const constant = (value: unknown): boolean => {
    switch (typeof value) {
        case 'string':
            return parse(value).every(item => item.type === 'text');
        case 'number':
        case 'boolean':
            return true;
        default:
            throw new Error(`constant not yet implemented for ${value} of type ${typeof value}`);
    }
};

/**
 * Returns the string with all dynamic interpolations replaced by the given variables
 * @examples
 * ```ts
 * evaluate('Hello ${secret:USER}', {secrets: {USER: 'jonathan'}}) => 'Hello jonathan'
 * evaluate('Hello ${node:createUser:user:name}', {nodes: {createUser: {user: {name: 'jonathan'}}}}) => 'Hello jonathan'
 * ```
 */
export const evaluate = (str: string, variables: Partial<Variables>): string => {
    return parse(str)
        .map(item => {
            switch (item.type) {
                case 'text':
                    return item.text;
                case 'node':
                    return access(variables.nodes?.[item.id]?.[item.property], item.path ?? '');
                case 'secret':
                    return variables.secrets?.[item.name] ?? '';
            }
        })
        .join('');
};
