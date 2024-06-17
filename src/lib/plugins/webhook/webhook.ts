import icon from '$lib/plugins/webhook/icon.svg';
import {trigger} from '$lib/core/plugins/trigger';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['path', 'method'] as const,
    properties: {
        path: {type: 'string'},
        method: {type: 'string'},
    },
} satisfies JsonSchema;

export default trigger<typeof configSchema>({
    icon,
    color: '#c93762',
    description: 'triggered when called via HTTP(s)',
    //
    form({config}) {
        return {
            type: 'object',
            properties: {
                path: {type: 'string', default: config.path},
                method: {type: 'string', enum: ['GET', 'POST', 'PATCH', 'DELETE'], default: config.method},
            },
        };
    },
    data({form, config, isConstant}) {
        const path = form?.path ?? config?.path ?? '/';
        const method = form?.method ?? config?.method ?? 'GET';

        return {
            valid: true,
            title: isConstant(path) && isConstant(method) ? `${method} ${path}` : undefined,
            config: {value: {path, method}, schema: configSchema},
            outputs: ['out'],
            results: {
                body: {type: 'string'},
                headers: {type: 'object', additionalProperties: {type: 'string'}},
            },
        };
    },
});
