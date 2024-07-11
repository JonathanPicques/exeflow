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

const urls = ['${env:SUPABASE_URL}'];
const keys = ['${env:SUPABASE_SERVICE_ROLE_KEY}'];

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
                url: {type: 'string', default: config.url, suggestions: urls},
                key: {type: 'string', default: config.key, suggestions: keys},
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
                    url: form?.url ?? config?.url ?? urls[0],
                    key: form?.key ?? config?.key ?? keys[0],
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
