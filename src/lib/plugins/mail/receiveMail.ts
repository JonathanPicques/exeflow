import icon from './icon.svg';
import {fill} from '$lib/schema/data';
import {trigger} from '$lib/core/plugins/trigger';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['tls', 'host', 'port', 'user', 'password', 'inbox'],
    properties: {
        tls: {type: 'boolean'},
        host: {type: 'string'},
        port: {type: 'number', editor: {suggestions: ['993', '143']}},
        user: {type: 'string'},
        password: {type: 'string'},
        //
        inbox: {type: 'string', editor: {suggestions: ['INBOX']}},
    },
} satisfies JsonSchema;

export default trigger<typeof configSchema>({
    icon,
    color: '#f3ce39',
    description: 'triggered when receiving a mail from an IMAP server',
    //
    form({config}) {
        return fill(configSchema, config);
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
