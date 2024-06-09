import icon from '$lib/plugins/mail/icon.svg';
import {action} from '$lib/core/plugins/action';

interface Config {
    tls: boolean;
    host: string;
    port: number;
    user: string;
    password: string;
    //
    to: string;
    from: string;
    subject: string;
    bodyText: string;
    bodyHtml: string;
}

export default action<Config>({
    icon,
    color: '#f3ce39',
    description: 'send a mail',
    //
    form({config}) {
        return {
            type: 'object',
            properties: {
                tls: {type: 'boolean', default: config.tls},
                host: {type: 'string', default: config.host},
                port: {type: 'number', default: config.port},
                user: {type: 'string', default: config.user},
                password: {type: 'string', default: config.password},
                //
                to: {type: 'string', default: config.to},
                from: {type: 'string', default: config.from},
                subject: {type: 'string', default: config.subject},
                bodyHtml: {type: 'string', title: 'mail in html', format: 'text', default: config.bodyHtml},
                bodyText: {type: 'string', title: 'mail in plain text', format: 'text', default: config.bodyText},
            },
        };
    },
    data({form, config}) {
        const f = form as Partial<Config> | undefined;

        return {
            valid: true,
            title: 'send mail',
            config: {
                tls: f?.tls ?? config?.tls ?? true,
                host: f?.host ?? config?.host ?? '',
                port: f?.port ?? config?.port ?? 587,
                user: f?.user ?? config?.user ?? '',
                password: f?.password ?? config?.password ?? '',
                //
                to: f?.to ?? config?.to ?? '',
                from: f?.from ?? config?.from ?? '',
                subject: f?.subject ?? config?.subject ?? '',
                bodyText: f?.bodyText ?? config?.bodyText ?? '',
                bodyHtml: f?.bodyHtml ?? config?.bodyHtml ?? '',
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
