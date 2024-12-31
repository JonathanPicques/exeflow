// imports must be relative for vite typechecking to work

import Ajv from 'ajv';
import type {z} from 'zod';

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
 * @returns true if the given data validates against the given zod schema
 * @example
 * ```ts
 * valid('hello', z.string()) => true
 * valid({name: 'killer7'}, z.string()) => false
 * ```
 */
export const valid2 = <T extends z.Schema>(data: unknown, schema: T): data is z.infer<T> => {
    return schema.safeParse(data).success;
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
    if (validator.validate(schema, data)) return data as InferJsonSchema<T>;
    throw new Error(errorMessage);
};
