import cronstrue from 'cronstrue';

import icon from './+icon.svg';
import {trigger} from '$lib/core/plugins/trigger';
import {fill, zero} from '$lib/core/schema/data';
import {tryFunction} from '$lib/core/helper/function';
import type {JsonSchema} from '$lib/core/schema/schema';

const configSchema = {
    type: 'object',
    required: ['interval'],
    properties: {
        interval: {type: 'string', default: '*/5 * * * *'},
    },
} satisfies JsonSchema;

export default trigger<typeof configSchema>({
    icon,
    color: '#a55ffe',
    description: 'triggered at the scheduled interval',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config, constant}) {
        const interval = form?.interval ?? config?.interval ?? zero(configSchema.properties.interval);
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
