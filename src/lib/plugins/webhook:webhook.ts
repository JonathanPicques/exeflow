import {trigger} from './@trigger';

interface Config {
    path: string;
}

export default trigger<Config>({
    icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/webhook.svg',
    color: '#c93762',
    title: 'webhook',
    description: 'triggered when called via HTTP(s)',
    //
    form({config}) {
        return {
            type: 'object',
            properties: {
                path: {type: 'string', default: config.path},
            },
        };
    },
    data({form, config}) {
        const typedForm = form as Partial<Config> | undefined;

        return {
            valid: true,
            config: {
                path: typedForm?.path ?? config?.path ?? '/',
            },
            outputs: ['out'],
            results: {
                body: {type: 'string'},
                method: {type: 'string', enum: ['GET', 'POST']},
                headers: {type: 'object', additionalProperties: {type: 'string'}},
            },
        };
    },
});
