import icon from './icon.svg';
import {fill} from '$lib/schema/data';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['url', 'depth', 'timeout'],
    properties: {
        url: {type: 'string'},
        depth: {type: 'number'},
        timeout: {type: 'number'},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#f3ce39',
    description: 'crawl website',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config}) {
        const url = form?.url ?? config?.url ?? '';
        const depth = form?.depth ?? config?.depth ?? 8;
        const timeout = form?.timeout ?? config?.timeout ?? 2000;

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
