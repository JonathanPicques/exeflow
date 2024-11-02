import icon from './+icon.svg';
import {fill} from '$lib/core/schema/data';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/core/schema/schema';

const configSchema = {} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#0c8ce9',
    description: 'try/catch',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data() {
        return {
            valid: true,
            config: {
                value: undefined,
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['try', 'catch'],
            results: {
                error: {type: 'string'},
            },
        };
    },
});
