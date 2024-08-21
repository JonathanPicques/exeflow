import icon from './icon.svg';
import {trigger} from '$lib/core/plugins/trigger';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['tls', 'host', 'port', 'user', 'password', 'inbox'],
    properties: {
        tls: {type: 'boolean'},
        host: {type: 'string'},
        port: {type: 'number'},
        user: {type: 'string'},
        password: {type: 'string'},
        //
        inbox: {type: 'string'},
    },
} satisfies JsonSchema;

export default trigger<typeof configSchema>({
    icon,
    color: '#f3ce39',
    description: 'triggered when receiving a mail',
    //
    form({config}) {
        return {
            type: 'object',
            required: ['tls', 'host', 'port', 'user', 'password', 'inbox'],
            properties: {
                tls: {type: 'boolean', default: config.tls},
                host: {type: 'string', default: config.host},
                port: {type: 'number', default: config.port, suggestions: ['993', '143']},
                user: {type: 'string', default: config.user},
                password: {type: 'string', default: config.password},
                //
                inbox: {type: 'string', default: config.inbox, suggestions: ['INBOX']},
            },
        };
    },
    data({form, config}) {
        return {
            valid: true,
            title: 'receive mail',
            config: {
                value: {
                    tls: form?.tls ?? config?.tls ?? true,
                    host: form?.host ?? config?.host ?? '',
                    port: form?.port ?? config?.port ?? 993,
                    user: form?.user ?? config?.user ?? '',
                    password: form?.password ?? config?.password ?? '',
                    //
                    inbox: form?.inbox ?? config?.inbox ?? 'INBOX',
                },
                schema: configSchema,
            },
            outputs: ['out'],
            results: {},
        };
    },
});
