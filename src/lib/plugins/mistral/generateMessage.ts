import icon from './icon.svg';
import {fill} from '$lib/schema/data';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';

const urls = ['https://api.mistral.ai'];
const models = ['mistral-embed'];

const configSchema = {
    type: 'object',
    required: ['url', 'apiKey', 'model', 'inputs'],
    properties: {
        url: {type: 'string', suggestions: urls},
        apiKey: {type: 'string', title: 'api key'},
        //
        model: {type: 'string', suggestions: models},
        prompt: {type: 'string'},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#ff7000',
    description: `generate a message from a prompt using Mistral's LLMs`,
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config}) {
        return {
            valid: true,
            config: {
                value: {
                    url: form?.url ?? config?.url ?? 'https://api.mistral.ai',
                    apiKey: form?.apiKey ?? config?.apiKey ?? '',
                    //
                    model: form?.model ?? config?.model ?? models[0],
                    prompt: form?.prompt ?? config?.prompt ?? '',
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                message: {type: 'string'},
            },
        };
    },
});
