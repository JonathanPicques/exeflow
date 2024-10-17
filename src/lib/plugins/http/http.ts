import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/schema/data';
import type {JsonSchema} from '$lib/schema/schema';

const methods = ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'];

const configSchema = {
    type: 'object',
    required: ['url', 'method'],
    properties: {
        url: {type: 'string'},
        method: {type: 'string', enum: methods, default: methods[0]},
        headers: {type: 'string', default: '{"Accept": "application/json"}'},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#494e55',
    description: 'perform a http request',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config}) {
        const url = form?.url ?? config?.url ?? zero(configSchema.properties.url);
        const method = form?.method ?? config?.method ?? zero(configSchema.properties.method);

        return {
            valid: url !== '',
            title: `${method} ${url}`,
            config: {
                value: {
                    url,
                    method,
                    headers: form?.headers ?? config?.headers ?? zero(configSchema.properties.headers),
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                text: {type: 'string'},
                status: {type: 'number'},
                headers: {type: 'string'},
            },
        };
    },
});
