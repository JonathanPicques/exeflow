import type {JSONSchema} from './schema';

export const compatible = (lhs: JSONSchema, rhs: JSONSchema) => {
    return lhs.type === rhs.type;
};
