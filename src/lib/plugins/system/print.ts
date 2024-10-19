import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/schema/data';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['text'] as const,
    properties: {
        text: {type: 'string'},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#0c8ce9',
    description: 'prints a text to the console',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config}) {
        return {
            valid: true,
            config: {
                value: {text: form?.text ?? config?.text ?? zero(configSchema.properties.text)},
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
