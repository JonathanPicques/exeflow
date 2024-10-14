import icon from './+icon.svg';
import {fill} from '$lib/schema/data';
import {action} from '$lib/core/plugins/action';
import {statusCodeMessages} from './+statusCodes';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['status'] as const,
    properties: {
        status: {type: 'number'},
    },
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
        const statusCode = form?.status ?? config?.status ?? 200;
        const statusCodeMessage = statusCodeMessages[statusCode.toString()];

        return {
            valid: !constant(statusCode) || statusCodeMessage !== undefined,
            title: statusCodeMessage ? `${statusCode} ${statusCodeMessage}` : undefined,
            config: {
                value: {status: statusCode},
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: [],
            results: {},
        };
    },
});
