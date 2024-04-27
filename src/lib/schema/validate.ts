import Ajv from 'ajv';
import type {FromSchema, JSONSchema} from './schema';

const validator = new Ajv();

export const valid = <T extends JSONSchema>(data: unknown, schema: T): data is FromSchema<T> => {
    return validator.validate(schema, data);
};

export const compatible = (lhs: JSONSchema, rhs: JSONSchema) => {
    return lhs.type === rhs.type;
};
