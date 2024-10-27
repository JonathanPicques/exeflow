import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/schema/data';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['query', 'connection'],
    properties: {
        query: {type: 'string', default: 'select * from users'},
        connection: {type: 'string'},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#336791',
    description: 'execute a query',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config, constant}) {
        const query = form?.query ?? config?.query ?? zero(configSchema.properties.query);

        return {
            valid: true,
            title: constant(query) ? query : undefined,
            config: {
                value: {
                    query,
                    connection: form?.connection ?? config?.connection ?? zero(configSchema.properties.connection),
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                count: {type: 'number'},
                result: {},
            },
        };
    },
});
