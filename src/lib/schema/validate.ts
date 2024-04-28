import Ajv from 'ajv';
import type {JsonSchema, InferJsonSchema} from './schema';

const validator = new Ajv();

export const valid = <T extends JsonSchema>(data: unknown, schema: T): data is InferJsonSchema<T> => {
    return validator.validate(schema, data);
};

export const compatible = (lhs: JsonSchema, rhs: JsonSchema) => {
    return lhs.type === rhs.type;
};
