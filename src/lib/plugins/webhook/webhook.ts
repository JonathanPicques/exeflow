import icon from './+icon.svg';
import {trigger} from '$lib/core/plugins/trigger';
import {fill, zero} from '$lib/schema/data';
import type {JsonSchema} from '$lib/schema/schema';

const methods = ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'];

const configSchema = {
    type: 'object',
    required: ['path', 'method'] as const,
    properties: {
        path: {type: 'string', default: '/'},
        method: {type: 'string', enum: methods, default: methods[0]},
    },
} satisfies JsonSchema;

export default trigger<typeof configSchema>({
    icon,
    color: '#c93762',
    description: 'triggered when called via HTTP(s)',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config, constant}) {
        const path = form?.path ?? config?.path ?? zero(configSchema.properties.path);
        const method = form?.method ?? config?.method ?? zero(configSchema.properties.method);

        return {
            valid: true,
            title: constant(path) && constant(method) ? `${method} ${path}` : undefined,
            config: {value: {path, method}, schema: configSchema},
            outputs: ['out'],
            results: {
                body: {type: 'string'},
                search: {type: 'object', additionalProperties: {type: 'string'}},
                headers: {type: 'object', additionalProperties: {type: 'string'}},
            },
        };
    },
});
