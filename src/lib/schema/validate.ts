import Ajv from 'ajv';
import type {JsonSchema, InferJsonSchema} from '$lib/schema/schema';

const validator = new Ajv();

export const zero = <T extends JsonSchema>(schema: T): InferJsonSchema<T> => {
    if (schema.const) return schema.const;
    if (schema.default) return schema.default;

    switch (schema.type) {
        case 'array':
            return [] as InferJsonSchema<T>;
        case 'number':
            return 0 as InferJsonSchema<T>;
        case 'string':
            return '' as InferJsonSchema<T>;
        case 'boolean':
            return false as InferJsonSchema<T>;
        case 'object': {
            return Object.keys(schema.properties ?? {}).reduce((obj, key) => {
                return {...obj, [key]: zero(schema.properties![key])};
            }, {} as InferJsonSchema<T>);
        }
    }
    throw new Error(`cannot generate zero value for the given schema`);
};

export const valid = <T extends JsonSchema>(data: unknown, schema: T): data is InferJsonSchema<T> => {
    return validator.validate(schema, data);
};

export const ensureValid = <T extends JsonSchema>(data: unknown, schema: T, errorMessage = 'cannot validate value against schema'): InferJsonSchema<T> => {
    if (validator.validate(schema, data)) return data as InferJsonSchema<T>;
    throw new Error(errorMessage);
};
