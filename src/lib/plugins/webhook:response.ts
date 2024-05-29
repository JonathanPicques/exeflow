import icon from '$lib/plugins/icons/webhook.svg';
import {action} from '$lib/plugins/@action';

interface Config {
    data: string;
    status: number;
}

export default action<Config>({
    icon,
    color: '#c93762',
    description: 'send a response back to the webhook',
    //
    form({config}) {
        return {
            type: 'object',
            properties: {
                data: {type: 'string', default: config.data},
                status: {type: 'number', default: config.status},
            },
        };
    },
    data({form, config}) {
        const f = form as Partial<Config> | undefined;
        const status = f?.status ?? config?.status ?? 200;

        return {
            valid: true,
            config: {
                data: f?.data ?? config?.data ?? '{"success": true}',
                status,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
