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
                model: {type: 'string', editor: {suggestions: ['llama3.2', 'llama3.1', 'qwen2:0.5b']}},
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
                model: {type: 'string', editor: {suggestions: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']}},
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
                model: {type: 'string', editor: {suggestions: ['mistral-small', 'mistral-medium', 'mistral-large']}},
                apiKey: {type: 'string', title: 'api key', default: '${secret:MISTRAL_API_KEY}'},
            },
        },
    },
} satisfies JsonSchema;

const anthropic = {
    type: 'object',
    required: ['type', 'settings'],
    properties: {
        type: {
            type: 'string' as const,
            const: 'anthropic' as const,
        },
        settings: {
            type: 'object',
            required: ['url', 'model', 'apiKey'],
            properties: {
                url: {type: 'string', editor: {suggestions: ['https://api.anthropic.com/v1']}},
                model: {type: 'string', editor: {suggestions: ['claude-3-5-sonnet-20241022']}},
                apiKey: {type: 'string', title: 'api key', editor: {suggestions: ['${secret:ANTHROPIC_API_KEY}']}},
            },
        },
    },
} satisfies JsonSchema;

const providers = {ollama, openai, mistral, anthropic};

const configSchema = {
    type: 'object',
    required: ['input', 'provider'],
    properties: {
        input: {type: 'string'},
        stream: {type: 'boolean'},
        provider: {anyOf: Object.values(providers)},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#CFC8FE',
    description: 'chat completion using Ollama, OpenAI (ChatGPT), MistralAI or Anthropic (Claude)',
    //
    form({config}) {
        const provider = providers[config.provider.type];

        return {
            ...configSchema,
            properties: {
                input: fill(configSchema.properties.input, config.input),
                stream: fill(configSchema.properties.stream, config.stream),
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
        const stream = form?.stream ?? config?.stream ?? zero(configSchema.properties.stream);
        const provider =
            form?.provider?.type && form.provider.type !== config?.provider.type
                ? zero(providers[form.provider.type]) // reset to default values if we switch the provider type
                : (form?.provider ?? config?.provider ?? zero(providers[type]));

        return {
            valid: true,
            title: provider.settings.model,
            config: {
                value: {input, stream, provider},
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                result: {type: 'string'},
            },
        };
    },
});
