import icon from './icon.svg';
import {action} from '$lib/core/plugins/action';
import {zero, fill} from '$lib/schema/data';
import type {JsonSchema} from '$lib/schema/schema';

const ollama = {
    type: 'object',
    required: ['type', 'settings'],
    properties: {
        type: {
            type: 'string' as const,
            const: 'ollama' as const,
        },
        settings: {
            type: 'object',
            required: ['url', 'model'],
            properties: {
                url: {type: 'string', editor: {suggestions: ['http://localhost:11434']}},
                model: {type: 'string', editor: {suggestions: ['all-minilm', 'nomic-embed-text', 'mxbai-embed-large', 'snowflake-arctic-embed']}},
            },
        },
    },
} satisfies JsonSchema;

const openai = {
    type: 'object',
    required: ['type', 'settings'],
    properties: {
        type: {
            type: 'string' as const,
            const: 'openai' as const,
        },
        settings: {
            type: 'object',
            required: ['model', 'apiKey'],
            properties: {
                model: {type: 'string', editor: {suggestions: ['text-embedding-ada-002', 'text-embedding-3-small', 'text-embedding-3-large']}},
                apiKey: {type: 'string', title: 'api key', editor: {suggestions: ['${secret:OPENAI_API_KEY}']}},
            },
        },
    },
} satisfies JsonSchema;

const mistral = {
    type: 'object',
    required: ['type', 'settings'],
    properties: {
        type: {
            type: 'string' as const,
            const: 'mistral' as const,
        },
        settings: {
            type: 'object',
            required: ['url', 'model', 'apiKey'],
            properties: {
                url: {type: 'string', editor: {suggestions: ['https://api.mistral.ai']}},
                model: {type: 'string', editor: {suggestions: ['mistral-embed']}},
                apiKey: {type: 'string', title: 'api key', editor: {suggestions: ['${secret:MISTRAL_API_KEY}']}},
            },
        },
    },
} satisfies JsonSchema;

const providers = {ollama, openai, mistral};

const configSchema = {
    type: 'object',
    required: ['input', 'provider'],
    properties: {
        input: {type: 'string', editor: {textarea: true}},
        provider: {anyOf: [ollama, openai, mistral]},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#f3ce39',
    description: 'embeddings using Ollama, MistralAI or OpenAI',
    //
    form({config}) {
        const provider = providers[config.provider.type];

        return {
            type: 'object',
            required: ['input', 'provider'],
            properties: {
                input: fill(configSchema.properties.input, config.input),
                provider: {
                    ...provider,
                    properties: {
                        type: {
                            type: 'string',
                            enum: Object.keys(providers),
                            default: config.provider.type,
                        } as any,
                        settings: fill(provider.properties.settings, config.provider.settings),
                    },
                },
            },
        };
    },
    data({form, config}) {
        const type = form?.provider?.type ?? config?.provider.type ?? 'ollama';
        const input = form?.input ?? config?.input ?? '';
        const provider =
            form?.provider?.type && form.provider.type !== config?.provider.type
                ? zero(providers[form.provider.type]) // reset to default values if we switch the provider type
                : (form?.provider ?? config?.provider ?? zero(providers[type]));

        return {
            valid: true,
            title: form?.provider?.settings.model ?? config?.provider.settings.model,
            config: {
                value: {input, provider},
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                result: {type: 'array', items: {type: 'number'}},
            },
        };
    },
});
