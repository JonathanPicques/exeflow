import * as privateEnv from '$env/static/private';
import type {JsonSchema, InferJsonSchema} from '$lib/schema/schema';

const env: Record<string, string> = privateEnv;
const envRegex = /\${env:([a-zA-Z0-9_-]+)}/gm;

/**
 * @examples
 * ```ts
 * resolve('Hello ${env:USER}', {type: 'string'}) => 'Hello jonathan'
 * resolve({title: 'Hello ${env:USER}'}, {type: 'object', properties: {title: {type: 'string'}}}) => ({title: 'Hello jonathan'})
 * ```
 */
export const resolve = <T extends JsonSchema>(what: InferJsonSchema<T>, schema: T): InferJsonSchema<T> => {
    switch (schema.type) {
        case 'string':
            return (what as string).replace(envRegex, match => {
                const name = match.substring(6, match.length - 1); // extract NAME from ${env:NAME}
                if (name.startsWith('EXEFLOW_')) {
                    console.error(`${match} is a reserved env variable`);
                    return '';
                }
                return env[name] ?? '';
            }) as InferJsonSchema<T>;
        case 'object': {
            return Object.keys(schema.properties ?? {}).reduce((obj, key) => {
                return {...obj, [key]: resolve(what[key], schema.properties![key])};
            }, {} as InferJsonSchema<T>);
        }
    }
    return what as InferJsonSchema<T>;
};
