import {trigger} from './@trigger';

interface Config {
    interval: string;
}

export default trigger<Config>({
    icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/scheduler.svg',
    color: '#a55ffe',
    description: 'triggered at the scheduled interval',
    //
    form({config}) {
        return {
            type: 'object',
            properties: {
                interval: {type: 'string', default: config.interval},
            },
        };
    },
    data({form, config}) {
        const typedForm = form as Partial<Config> | undefined;

        return {
            valid: true,
            title: 'every 30 minutes',
            config: {
                interval: typedForm?.interval ?? config?.interval ?? '*/30 * * * *',
            },
            outputs: ['out'],
            results: {},
        };
    },
});
