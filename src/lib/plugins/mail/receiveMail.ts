import icon from './+icon.svg';
import {trigger} from '$lib/core/plugins/trigger';
import {fill, zero} from '$lib/core/schema/data';
import type {JsonSchema} from '$lib/core/schema/schema';

const configSchema = {
    type: 'object',
    required: ['tls', 'host', 'port', 'user', 'password', 'inbox'],
    properties: {
        tls: {type: 'boolean', default: true},
        host: {type: 'string'},
        port: {type: 'number', default: 993, editor: {suggestions: ['993', '143']}},
        user: {type: 'string'},
        password: {type: 'string'},
        //
        inbox: {type: 'string', default: 'INBOX'},
    },
    additionalProperties: false,
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
            config: {
                value: {
                    tls: form?.tls ?? config?.tls ?? zero(configSchema.properties.tls),
                    host: form?.host ?? config?.host ?? zero(configSchema.properties.host),
                    port: form?.port ?? config?.port ?? zero(configSchema.properties.port),
                    user: form?.user ?? config?.user ?? zero(configSchema.properties.user),
                    password: form?.password ?? config?.password ?? zero(configSchema.properties.password),
                    //
                    inbox: form?.inbox ?? config?.inbox ?? zero(configSchema.properties.inbox),
                },
                schema: configSchema,
            },
            outputs: ['out'],
            results: {},
        };
    },
});
