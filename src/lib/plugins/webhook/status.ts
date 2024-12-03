import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/core/plugins/config/data';
import {statusCodeMessages} from './+statusCodes';
import type {JsonSchema} from '$lib/core/schema/schema';

const configSchema = {
    type: 'object',
    required: ['status'] as const,
    properties: {
        status: {type: 'number', default: 200},
    },
    additionalProperties: false,
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#c93762',
    description: 'sets the status code of the webhook response',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config, constant}) {
        const statusCode = form?.status ?? config?.status ?? zero(configSchema.properties.status);
        const statusCodeMessage = statusCodeMessages[statusCode.toString()];

        return {
            valid: !constant(statusCode) || statusCodeMessage !== undefined,
            title: statusCodeMessage ? `${statusCode} ${statusCodeMessage}` : undefined,
            config: {
                value: {status: statusCode},
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
