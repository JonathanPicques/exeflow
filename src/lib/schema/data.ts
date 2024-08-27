import {valid} from './validate';
import type {JsonSchema} from './schema';
import type {InferJsonSchema} from './infer';

/**
 * @returns a new value from the given schema.
 * @example
 * ```ts
 * zero({type: 'string'}) => ''
 * zero({type: 'string', const: 'hello!'}) => 'hello!'
 * zero({type: 'string', default: 'welcome!'}) => 'welcome!'
 * zero({type: 'string', const: 'hello!', default: 'welcome!'}) => 'hello!'
 * zero({type: 'object') => ({})
 * zero({type: 'object', properties: {name: {type: 'string', default: 'Joel'}}) => ({name: 'Joel'})
 * ```
 */
export const zero = <T extends JsonSchema>(schema: T): InferJsonSchema<T> => {
    if (schema.const) return schema.const;
    if (schema.default) return schema.default;

    switch (schema.type) {
        case undefined:
            return undefined as InferJsonSchema<T>; // any
        case 'number':
            return 0 as InferJsonSchema<T>;
        case 'string':
            return (schema.suggestions?.[0] ?? '') as InferJsonSchema<T>;
        case 'boolean':
            return false as InferJsonSchema<T>;
        //
        case 'array':
            return [] as InferJsonSchema<T>;
        case 'object': {
            return Object.keys(schema.properties ?? {}).reduce((obj, key) => {
                return {...obj, [key]: zero(schema.properties![key])};
            }, {} as InferJsonSchema<T>);
        }
    }
};

/**
 * @returns a new schema with the default filled recursively.
 * @example
 * ```ts
 * fill({type: 'string'}, 'welcome') => ({type: 'string', default: 'welcome'})
 * fill({type: 'number'}, 'not a number') => ({type: 'number'})
 * ```
 */
export const fill = <T extends JsonSchema>(schema: T, defaultValue: InferJsonSchema<T>): T => {
    switch (schema.type) {
        case undefined: {
            return {...schema, default: defaultValue}; // any
        }
        case 'number':
        case 'string':
        case 'boolean':
            if (valid(defaultValue, schema)) {
                return {...schema, default: defaultValue};
            }
            break;
        case 'object': {
            if (valid(defaultValue, schema)) {
                return {...schema, default: defaultValue};
            }

            if (!schema.properties) break;
            if (!defaultValue || typeof defaultValue !== 'object') break;

            return {
                ...schema,
                properties: Object.entries(schema.properties).reduce((props, [key, subschema]) => {
                    return {...props, [key]: fill(subschema, defaultValue[key])};
                }, {}),
            };
        }
        case 'array': {
            if (valid(defaultValue, schema)) {
                return {...schema, default: defaultValue};
            }
            break;
        }
    }
    return schema;
};
