import icon from './+icon.svg';
import {fill} from '$lib/schema/data';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['body'] as const,
    properties: {
        body: {type: 'string', editor: {textarea: true}},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#c93762',
    description: 'send a chunk back to the webhook',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config}) {
        return {
            valid: true,
            config: {
                value: {
                    body: form?.body ?? config?.body ?? '',
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
