import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/core/schema/data';
import type {JsonSchema} from '$lib/core/schema/schema';

const configSchema = {
    type: 'object',
    required: ['url', 'key', 'userId'],
    properties: {
        url: {type: 'string'},
        key: {type: 'string'},
        //
        userId: {type: 'string'},
    },
    additionalProperties: false,
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#3ecf8e',
    description: 'delete an user by id',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config}) {
        return {
            valid: true,
            config: {
                value: {
                    url: form?.url ?? config?.url ?? zero(configSchema.properties.url),
                    key: form?.key ?? config?.key ?? zero(configSchema.properties.key),
                    //
                    userId: form?.userId ?? config?.userId ?? zero(configSchema.properties.userId),
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
