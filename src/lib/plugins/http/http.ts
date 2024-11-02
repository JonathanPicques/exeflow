import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/core/schema/data';
import type {JsonSchema} from '$lib/core/schema/schema';

const methods = ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'];

const configSchema = {
    type: 'object',
    required: ['url', 'method', 'body', 'search', 'headers'],
    properties: {
        url: {type: 'string'},
        method: {type: 'string', enum: methods, default: methods[0]},
        body: {type: 'string'},
        search: {type: 'object', additionalProperties: {type: 'string'}, default: {page: '1', count: '10'}},
        headers: {type: 'object', additionalProperties: {type: 'string'}, default: {'Content-Type': 'application/json'}},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#c93762',
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
                    body: form?.body ?? config?.body ?? zero(configSchema.properties.body),
                    method,
                    search: form?.search ?? config?.search ?? zero(configSchema.properties.search),
                    headers: form?.headers ?? config?.headers ?? zero(configSchema.properties.headers),
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                body: {type: 'string'},
                status: {type: 'number'},
                headers: {type: 'string'},
            },
        };
    },
});
