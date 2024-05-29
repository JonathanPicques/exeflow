import icon from '$lib/plugins/icons/mail.svg';
import {trigger} from '$lib/plugins/@trigger';

interface Config {
    tls: boolean;
    host: string;
    port: string;
    user: string;
    password: string;
    //
    inbox: string;
}

export default trigger<Config>({
    icon,
    color: '#f3ce39',
    description: 'triggered when receiving a mail',
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
                inbox: {type: 'string', default: config.inbox},
            },
        };
    },
    data({form, config}) {
        const f = form as Partial<Config> | undefined;

        return {
            valid: true,
            title: 'receive mail',
            config: {
                tls: f?.tls ?? config?.tls ?? true,
                host: f?.host ?? config?.host ?? '',
                port: f?.port ?? config?.port ?? '',
                user: f?.user ?? config?.user ?? '',
                password: f?.password ?? config?.password ?? '',
                //
                inbox: f?.inbox ?? config?.inbox ?? 'INBOX',
            },
            outputs: ['out'],
            results: {},
        };
    },
});
