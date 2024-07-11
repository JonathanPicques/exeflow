import icon from './icon.svg';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['url', 'key', 'userId'],
    properties: {
        url: {type: 'string'},
        key: {type: 'string'},
        //
        userId: {type: 'string'},
    },
} satisfies JsonSchema;

const urls = ['${env:SUPABASE_URL}'];
const keys = ['${env:SUPABASE_SERVICE_ROLE_KEY}'];

export default action<typeof configSchema>({
    icon,
    color: '#3ecf8e',
    description: 'delete an user by id',
    //
    form({config}) {
        return {
            type: 'object',
            required: ['url', 'apiKey', 'userId'],
            properties: {
                url: {type: 'string', default: config.url, suggestions: urls},
                key: {type: 'string', default: config.key, suggestions: keys},
                //
                userId: {type: 'string', default: config.userId},
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
                    userId: form?.userId ?? config?.userId ?? '',
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
