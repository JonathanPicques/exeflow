import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/core/plugins/config/data';
import type {JsonSchema} from '$lib/core/schema/schema';

const configSchema = {
    type: 'object',
    properties: {
        tls: {type: 'boolean', default: true},
        host: {type: 'string'},
        port: {type: 'number', default: 587, editor: {suggestions: ['587', '465', '2525']}},
        user: {type: 'string'},
        password: {type: 'string'},
        //
        to: {type: 'string'},
        from: {type: 'string'},
        subject: {type: 'string'},
        bodyHtml: {type: 'string', title: 'mail in html'},
        bodyText: {type: 'string', title: 'mail in plain text'},
    },
    additionalProperties: false,
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#f3ce39',
    description: 'send a mail using SMTP',
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
                    to: form?.to ?? config?.to ?? zero(configSchema.properties.to),
                    from: form?.from ?? config?.from ?? zero(configSchema.properties.from),
                    subject: form?.subject ?? config?.subject ?? zero(configSchema.properties.subject),
                    bodyText: form?.bodyText ?? config?.bodyText ?? zero(configSchema.properties.bodyText),
                    bodyHtml: form?.bodyHtml ?? config?.bodyHtml ?? zero(configSchema.properties.bodyHtml),
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
