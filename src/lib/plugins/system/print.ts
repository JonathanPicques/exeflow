import icon from './icon.svg';
import {action} from '$lib/core/plugins/action';
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
    color: '#c93762',
    description: 'prints a text to the console',
    //
    form({config}) {
        return {
            type: 'object',
            properties: {
                text: {type: 'string', default: config.text},
            },
        };
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
