import Ajv from 'ajv';
import type {JsonSchema, InferJsonSchema} from '$lib/schema/schema';

const validator = new Ajv();

export const zero = (schema: JsonSchema): unknown => {
    if (schema.const) return schema.const;
    if (schema.default) return schema.default;
    if (schema.type === 'object' && schema.properties) {
        return Object.keys(schema.properties).reduce((obj, key) => {
            return {...obj, [key]: zero(schema.properties![key])};
        }, {});
    }
};

export const valid = <T extends JsonSchema>(data: unknown, schema: T): data is InferJsonSchema<T> => {
    return validator.validate(schema, data);
};

export const compatible = (lhs: JsonSchema, rhs: JsonSchema) => {
    return lhs.type === rhs.type;
};
