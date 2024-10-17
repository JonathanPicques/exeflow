import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/schema/data';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['headers'] as const,
    properties: {
        headers: {type: 'object', default: {'Content-Type': 'application/json'}, additionalProperties: {type: 'string'}},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#c93762',
    description: 'set the headers of the webhook response',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config, constant}) {
        const headers = form?.headers ?? config?.headers ?? zero(configSchema.properties.headers);

        return {
            valid: true,
            title: Object.keys(headers)
                .filter(header => constant(header))
                .join(', '),
            config: {
                value: {headers},
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
