import icon from './icon.svg';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['model', 'prompt'],
    properties: {
        url: {type: 'string'},
        apiKey: {type: 'string'},
        //
        model: {type: 'string'},
        prompt: {type: 'string'},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#ff7000',
    description: `generate a message from a prompt using Mistral's LLMs`,
    //
    form({config}) {
        return {
            type: 'object',
            required: ['model', 'prompt'],
            properties: {
                url: {type: 'string', default: config.url},
                apiKey: {type: 'string', default: config.apiKey},
                //
                model: {type: 'string', default: config.model},
                prompt: {type: 'string', format: 'text', default: config.prompt},
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
                    model: form?.model ?? config?.model ?? 'mistral',
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
