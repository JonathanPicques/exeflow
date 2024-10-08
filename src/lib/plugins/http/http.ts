import icon from './+icon.svg';
import {fill} from '$lib/schema/data';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';

const methods = ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS'];

const configSchema = {
    type: 'object',
    required: ['url', 'method'],
    properties: {
        url: {type: 'string'},
        method: {type: 'string', enum: methods},
        headers: {type: 'string'},
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
        const url = form?.url ?? config?.url ?? '';
        const method = form?.method ?? config?.method ?? 'POST';

        return {
            valid: url !== '',
            title: `${method} ${url}`,
            config: {
                value: {
                    url,
                    method: form?.method ?? config?.method ?? 'POST',
                    headers: form?.headers ?? config?.headers ?? '{"Accept": "application/json"}',
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
