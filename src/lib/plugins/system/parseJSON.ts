import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/core/schema/data';
import type {JsonSchema} from '$lib/core/schema/schema';

const configSchema = {
    type: 'object',
    required: ['text', 'schema'] as const,
    properties: {
        text: {type: 'string'},
        schema: {type: 'object'},
    },
    additionalProperties: false,
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
        const schema = form?.schema ?? config?.schema ?? zero(configSchema.properties.schema);

        return {
            valid: true,
            config: {
                value: {
                    text: form?.text ?? config?.text ?? zero(configSchema.properties.text),
                    schema,
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                json: schema,
            },
        };
    },
});
