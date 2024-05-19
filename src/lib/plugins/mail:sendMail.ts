import {action} from '$lib/plugins/@action';

interface Config {
    tls: boolean;
    host: string;
    port: string;
    user: string;
    password: string;
    //
    to: string;
    from: string;
    bodyText: string;
    bodyHtml: string;
}

export default action<Config>({
    icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/smtp.svg',
    color: '#f3ce39',
    description: 'send a mail',
    //
    form({config}) {
        return {
            type: 'object',
            properties: {
                tls: {type: 'boolean', default: config.tls},
                host: {type: 'string', default: config.host},
                port: {type: 'string', default: config.port},
                user: {type: 'string', default: config.user},
                password: {type: 'string', default: config.password},
                //
                to: {type: 'string', default: config.to},
                from: {type: 'string', default: config.from},
                bodyText: {type: 'string', default: config.bodyText},
                bodyHtml: {type: 'string', default: config.bodyHtml},
            },
        };
    },
    data({form, config}) {
        const typedForm = form as Partial<Config> | undefined;

        return {
            valid: true,
            title: 'send mail',
            config: {
                tls: typedForm?.tls ?? config?.tls ?? true,
                host: typedForm?.host ?? config?.host ?? '',
                port: typedForm?.port ?? config?.port ?? '',
                user: typedForm?.user ?? config?.user ?? '',
                password: typedForm?.password ?? config?.password ?? '',
                //
                to: typedForm?.to ?? config?.to ?? '',
                from: typedForm?.from ?? config?.from ?? '',
                bodyText: typedForm?.bodyText ?? config?.bodyText ?? '',
                bodyHtml: typedForm?.bodyHtml ?? config?.bodyHtml ?? '',
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
