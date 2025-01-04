// imports must be relative for vite typechecking to work

import Ajv from 'ajv';

import type {JsonSchema} from './schema';
import type {InferJsonSchema} from './infer';

const validator = new Ajv({keywords: ['editor']});

/**
 * @returns true if the given data validates against the given schema
 * @example
 * ```ts
 * valid('hello', {type: 'string'}) => true
 * valid({name: 'killer7'}, {type: 'string'}) => false
 * ```
 */
export const valid = <T extends JsonSchema>(data: unknown, schema: T): data is InferJsonSchema<T> => {
    return validator.validate(schema, data);
};

/**
 * @returns the given data if it validates against the given schema
 * @throws otherwise
 * @example
 * ```ts
 * const age = ensure('Paris', {type: 'number'}, 'age must be a number'); // throws
 * const city = ensure('Paris', {type: 'string'}, 'city must be a string'); // does not throw
 * ```
 */
export const ensure = <T extends JsonSchema>(data: unknown, schema: T, errorMessage = 'cannot validate value against schema'): InferJsonSchema<T> => {
    if (valid(data, schema)) return data;
    throw new Error(errorMessage);
};
