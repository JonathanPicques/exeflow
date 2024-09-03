import Ajv from 'ajv';
import type {JsonSchema} from '$lib/schema/schema';
import type {InferJsonSchema} from '$lib/schema/infer';

const validator = new Ajv({keywords: ['editor']});

export const valid = <T extends JsonSchema>(data: unknown, schema: T): data is InferJsonSchema<T> => {
    return validator.validate(schema, data);
};

export const validOrThrow = <T extends JsonSchema>(data: unknown, schema: T, errorMessage = 'cannot validate value against schema'): InferJsonSchema<T> => {
    if (validator.validate(schema, data)) return data as InferJsonSchema<T>;
    throw new Error(errorMessage);
};
