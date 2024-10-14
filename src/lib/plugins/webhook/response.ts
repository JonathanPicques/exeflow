import icon from './+icon.svg';
import {fill} from '$lib/schema/data';
import {action} from '$lib/core/plugins/action';
import {statusCodeMessages} from './+statusCodes';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['body', 'status', 'headers'] as const,
    properties: {
        body: {type: 'string', editor: {textarea: true}},
        status: {type: 'number'},
        headers: {type: 'object', additionalProperties: {type: 'string'}},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#c93762',
    description: 'send a response back to the webhook',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config, constant}) {
        const statusCode = form?.status ?? config?.status ?? 200;
        const statusCodeMessage = statusCodeMessages[statusCode.toString()];

        return {
            valid: statusCodeMessage !== undefined || constant(statusCode) === false,
            title: statusCodeMessage ? `${statusCode} ${statusCodeMessage}` : undefined,
            config: {
                value: {
                    body: form?.body ?? config?.body ?? '{"success": true}',
                    status: statusCode,
                    headers: form?.headers ?? config?.headers ?? {'Content-Type': 'application/json'},
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: [],
            results: {},
        };
    },
});
