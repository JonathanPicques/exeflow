import cronstrue from 'cronstrue';

import icon from './icon.svg';
import {trigger} from '$lib/core/plugins/trigger';
import {tryFunction} from '$lib/helper/error';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['interval'],
    properties: {
        interval: {type: 'string'},
    },
} satisfies JsonSchema;

export default trigger<typeof configSchema>({
    icon,
    color: '#a55ffe',
    description: 'triggered at the scheduled interval',
    //
    form({config}) {
        return {
            type: 'object',
            required: ['interval'],
            properties: {
                interval: {type: 'string', default: config.interval},
            },
        };
    },
    data({form, config, constant}) {
        const interval = form?.interval ?? config?.interval ?? '*/5 * * * *';
        const intervalForHumans = constant(interval) ? tryFunction(() => cronstrue.toString(interval, {use24HourTimeFormat: true})) : 'dynamic interval';

        return {
            valid: intervalForHumans !== undefined,
            title: intervalForHumans?.toLocaleLowerCase() ?? 'invalid interval',
            config: {value: {interval}, schema: configSchema},
            outputs: ['out'],
            results: {},
        };
    },
});
