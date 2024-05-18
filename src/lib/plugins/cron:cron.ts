import cronstrue from 'cronstrue';

import {trigger} from '$lib/plugins/@trigger';
import {inlineThrowFn} from '$lib/helper/error';

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

        const interval = typedForm?.interval ?? config?.interval ?? '*/5 * * * *';
        const intervalForHumans = inlineThrowFn(() => cronstrue.toString(interval, {use24HourTimeFormat: true}));

        return {
            valid: intervalForHumans !== undefined,
            title: intervalForHumans ?? 'invalid interval',
            config: {interval},
            outputs: ['out'],
            results: {},
        };
    },
});
