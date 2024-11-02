import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {zero, fill} from '$lib/core/schema/data';
import type {JsonSchema} from '$lib/core/schema/schema';

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
                url: {type: 'string', default: 'http://localhost:11434'},
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
                apiKey: {type: 'string', title: 'api key', default: '${secret:OPENAI_API_KEY}'},
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
                url: {type: 'string', default: 'https://api.mistral.ai'},
                model: {type: 'string', editor: {suggestions: ['mistral-embed']}},
                apiKey: {type: 'string', title: 'api key', default: '${secret:MISTRAL_API_KEY}'},
            },
        },
    },
} satisfies JsonSchema;

const providers = {ollama, openai, mistral};

const configSchema = {
    type: 'object',
    required: ['input', 'provider'],
    properties: {
        input: {type: 'string'},
        provider: {anyOf: [ollama, openai, mistral]},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#CFC8FE',
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
        const type = form?.provider?.type ?? config?.provider.type ?? zero(ollama.properties.type);
        const input = form?.input ?? config?.input ?? zero(configSchema.properties.input);
        const provider =
            form?.provider?.type && form.provider.type !== config?.provider.type
                ? zero(providers[form.provider.type]) // reset to default values if we switch the provider type
                : (form?.provider ?? config?.provider ?? zero(providers[type]));

        return {
            valid: true,
            title: provider.settings.model,
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
