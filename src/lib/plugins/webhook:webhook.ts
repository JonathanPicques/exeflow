import {trigger} from './@trigger';
import type {JsonSchema} from '$lib/schema/schema';

interface Config {
    exposeBody: boolean;
    exposeMethod: boolean;
    exposeHeaders: boolean;
}

export default trigger<Config>({
    icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/webhook.svg',
    title: 'webhook',
    description: 'runs a scenario when called via HTTP(s)',
    //
    form({config}) {
        return {
            type: 'object',
            properties: {
                url: {type: 'string', const: 'http://webhook.exeflow.com/some-id'},
                exposeBody: {type: 'boolean', default: config.exposeBody},
                exposeMethod: {type: 'boolean', default: config.exposeMethod},
                exposeHeaders: {type: 'boolean', default: config.exposeHeaders},
            },
        };
    },
    data({form, config}) {
        const results = {} as Record<string, JsonSchema>;
        const typedForm = form as Partial<Config> | undefined;

        if (config?.exposeBody) {
            results['body'] = {type: 'string'};
        }
        if (config?.exposeMethod) {
            results['method'] = {type: 'string'};
        }
        if (config?.exposeHeaders) {
            results['headers'] = {type: 'object', additionalProperties: {type: 'string'}};
        }

        return {
            valid: true,
            config: {
                exposeBody: typedForm?.exposeBody ?? config?.exposeBody ?? true,
                exposeMethod: typedForm?.exposeMethod ?? config?.exposeMethod ?? false,
                exposeHeaders: typedForm?.exposeHeaders ?? config?.exposeHeaders ?? false,
            },
            outputs: ['out'],
            results,
        };
    },
});
