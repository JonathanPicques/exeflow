import icon from './+icon.svg';
import {fill} from '$lib/schema/data';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['text'] as const,
    properties: {
        text: {type: 'string', editor: {textarea: true}},
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
                value: {text: form?.text ?? config?.text ?? ''},
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
