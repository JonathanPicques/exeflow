import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/schema/data';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['json'] as const,
    properties: {
        json: {type: 'string'},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#0c8ce9',
    description: 'parse json',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config}) {
        return {
            valid: true,
            config: {
                value: {json: form?.json ?? config?.json ?? zero(configSchema.properties.json)},
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                json: {},
            },
        };
    },
});
