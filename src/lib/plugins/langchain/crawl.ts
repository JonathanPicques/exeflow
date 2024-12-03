import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/core/schema/data';
import type {JsonSchema} from '$lib/core/schema/schema';

const configSchema = {
    type: 'object',
    required: ['url', 'depth', 'timeout'],
    properties: {
        url: {type: 'string'},
        depth: {type: 'number', default: 8},
        timeout: {type: 'number', default: 2000},
    },
    additionalProperties: false,
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#CFC8FE',
    description: 'crawl website',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config}) {
        const url = form?.url ?? config?.url ?? zero(configSchema.properties.url);
        const depth = form?.depth ?? config?.depth ?? zero(configSchema.properties.depth);
        const timeout = form?.timeout ?? config?.timeout ?? zero(configSchema.properties.timeout);

        return {
            valid: !!url && depth > 0 && timeout >= 0,
            title: url,
            config: {
                value: {url, depth, timeout},
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                pages: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['metadata', 'pageContent'],
                        properties: {
                            metadata: {
                                type: 'object',
                                required: ['source'],
                                properties: {
                                    title: {type: 'string'},
                                    source: {type: 'string'},
                                    language: {type: 'string'},
                                    description: {type: 'string'},
                                },
                            },
                            pageContent: {type: 'string'},
                        },
                    },
                },
            },
        };
    },
});
