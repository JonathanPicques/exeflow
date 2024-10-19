import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/schema/data';
import {statusCodeMessages} from './+statusCodes';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['body', 'status', 'headers'] as const,
    properties: {
        body: {type: 'string'},
        status: {type: 'number', default: 200},
        headers: {type: 'object', default: {'Content-Type': 'application/json'}, additionalProperties: {type: 'string'}},
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
        const statusCode = form?.status ?? config?.status ?? zero(configSchema.properties.status);
        const statusCodeMessage = statusCodeMessages[statusCode.toString()];

        return {
            valid: statusCodeMessage !== undefined || constant(statusCode) === false,
            title: statusCodeMessage ? `${statusCode} ${statusCodeMessage}` : undefined,
            config: {
                value: {
                    body: form?.body ?? config?.body ?? zero(configSchema.properties.body),
                    status: statusCode,
                    headers: form?.headers ?? config?.headers ?? zero(configSchema.properties.headers),
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: [],
            results: {},
        };
    },
});
