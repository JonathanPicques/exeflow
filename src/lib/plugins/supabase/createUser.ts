import icon from './icon.svg';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';

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
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#3ecf8e',
    description: 'create an user with email/password',
    //
    form({config}) {
        return {
            type: 'object',
            required: ['url', 'apiKey', 'email', 'password'],
            properties: {
                url: {type: 'string', default: config.url},
                key: {type: 'string', default: config.key},
                //
                email: {type: 'string', default: config.email},
                password: {type: 'string', format: 'text', default: config.password},
            },
        };
    },
    data({form, config}) {
        return {
            valid: true,
            config: {
                value: {
                    url: form?.url ?? config?.url ?? '',
                    key: form?.key ?? config?.key ?? '',
                    //
                    email: form?.email ?? config?.email ?? '',
                    password: form?.password ?? config?.password ?? '',
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
