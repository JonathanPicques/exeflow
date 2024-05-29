import cronstrue from 'cronstrue';

import icon from '$lib/plugins/icons/cron.svg';
import {trigger} from '$lib/plugins/@trigger';
import {tryFunction} from '$lib/helper/error';

interface Config {
    interval: string;
}

export default trigger<Config>({
    icon,
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
        const f = form as Partial<Config> | undefined;
        const interval = f?.interval ?? config?.interval ?? '*/5 * * * *';
        const intervalForHumans = tryFunction(() => cronstrue.toString(interval, {use24HourTimeFormat: true}));

        return {
            valid: intervalForHumans !== undefined,
            title: intervalForHumans?.toLocaleLowerCase() ?? 'invalid interval',
            config: {interval},
            outputs: ['out'],
            results: {},
        };
    },
});
