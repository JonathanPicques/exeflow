import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/core/plugins/config/data';
import type {JsonSchema} from '$lib/core/schema/schema';

const configSchema = {
    type: 'object',
    required: ['url', 'key', 'email', 'password'],
    properties: {
        url: {type: 'string'},
        key: {type: 'string'},
        //
        email: {type: 'string'},
        password: {type: 'string'},
    },
    additionalProperties: false,
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#3ecf8e',
    description: 'create an user with email/password',
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
                    email: form?.email ?? config?.email ?? zero(configSchema.properties.email),
                    password: form?.password ?? config?.password ?? zero(configSchema.properties.password),
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                userId: {type: 'string'},
            },
        };
    },
});
