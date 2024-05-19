import icon from '$lib/plugins/icons/webhook.svg';
import {trigger} from '$lib/plugins/@trigger';

interface Config {
    path: string;
    method: string;
}

export default trigger<Config>({
    icon,
    color: '#c93762',
    description: 'triggered when called via HTTP(s)',
    //
    form({config}) {
        return {
            type: 'object',
            properties: {
                path: {type: 'string', default: config.path},
                method: {type: 'string', enum: ['GET', 'POST', 'PATCH', 'DELETE'], default: config.method},
            },
        };
    },
    data({form, config}) {
        const typedForm = form as Partial<Config> | undefined;

        const path = typedForm?.path ?? config?.path ?? '/';
        const method = typedForm?.method ?? config?.method ?? 'GET';

        return {
            valid: true,
            title: `${method} ${path}`,
            config: {path, method},
            outputs: ['out'],
            results: {
                body: {type: 'string'},
                headers: {type: 'object', additionalProperties: {type: 'string'}},
            },
        };
    },
});
