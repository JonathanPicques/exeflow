import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/core/plugins/config/data';
import type {JsonSchema} from '$lib/core/schema/schema';

const configSchema = {
    type: 'object',
    required: ['count'] as const,
    properties: {
        count: {type: 'number', default: 3},
    },
    additionalProperties: false,
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#0c8ce9',
    description: 'repeats any given number of times',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config}) {
        return {
            valid: true,
            config: {
                value: {
                    count: form?.count ?? config?.count ?? zero(configSchema.properties.count),
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                index: {type: 'number'},
            },
        };
    },
});
