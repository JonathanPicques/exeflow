import icon from './icon.svg';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['model', 'input'],
    properties: {
        url: {type: 'string'},
        apiKey: {type: 'string'},
        //
        model: {type: 'string'},
        input: {type: 'string'},
    },
} satisfies JsonSchema;

const urls = ['https://api.mistral.ai'];
const models = ['mistral-embed'];
const apiKeys = ['${env:MISTRAL_API_KEY}'];

export default action<typeof configSchema>({
    icon,
    color: '#ff7000',
    description: `generate embeddings using Mistral's embedding models`,
    //
    form({config}) {
        return {
            type: 'object',
            required: ['model', 'input'],
            properties: {
                url: {type: 'string', default: config.url, suggestions: urls},
                apiKey: {type: 'string', default: config.apiKey, suggestions: apiKeys},
                //
                model: {type: 'string', default: config.model, suggestions: models},
                input: {type: 'string', format: 'text', default: config.input},
            },
        };
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
                    input: form?.input ?? config?.input ?? '',
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                embeddings: {type: 'array', items: {type: 'number'}},
            },
        };
    },
});
