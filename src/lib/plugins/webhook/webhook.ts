import icon from './+icon.svg';
import {fill} from '$lib/schema/data';
import {trigger} from '$lib/core/plugins/trigger';
import type {JsonSchema} from '$lib/schema/schema';

const methods = ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'];

const configSchema = {
    type: 'object',
    required: ['path', 'method'] as const,
    properties: {
        path: {type: 'string'},
        method: {type: 'string', enum: methods},
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
        const path = form?.path ?? config?.path ?? '/';
        const method = form?.method ?? config?.method ?? 'GET';

        return {
            valid: true,
            title: constant(path) && constant(method) ? `${method} ${path}` : undefined,
            config: {value: {path, method}, schema: configSchema},
            outputs: ['out'],
            results: {
                body: {type: 'string'},
                query: {type: 'object', additionalProperties: {type: 'string'}},
                headers: {type: 'object', additionalProperties: {type: 'string'}},
            },
        };
    },
});
