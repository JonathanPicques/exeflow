import icon from './icon.svg';
import {fill} from '$lib/schema/data';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['url', 'key', 'userId'],
    properties: {
        url: {type: 'string'},
        key: {type: 'string'},
        //
        userId: {type: 'string'},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#3ecf8e',
    description: 'delete an user by id',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config}) {
        return {
            valid: true,
            config: {
                value: {
                    url: form?.url ?? config?.url ?? '',
                    key: form?.key ?? config?.key ?? '',
                    //
                    userId: form?.userId ?? config?.userId ?? '',
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
