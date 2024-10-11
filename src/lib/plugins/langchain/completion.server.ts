import {serverAction} from '$lib/core/plugins/action.server';
import type action from './completion';

export default serverAction<typeof action>({
    exec: async function* ({next, config, signal}) {
        const {input, stream} = config;

        switch (config.provider.type) {
            case 'ollama': {
                const {ChatOllama} = await import('@langchain/ollama');
                const {url, model} = config.provider.settings;
                const chat = new ChatOllama({baseUrl: url, model});

                if (stream) {
                    for await (const chunk of await chat.stream(input)) {
                        yield* next({output: 'out', results: {result: chunk.content}});
                    }
                    return;
                }
                yield* next({output: 'out', results: {result: (await chat.invoke(input, {signal})).content}});
                return;
            }
            case 'openai': {
                const {ChatOpenAI} = await import('@langchain/openai');
                const {model, apiKey} = config.provider.settings;
                const chat = new ChatOpenAI({model, apiKey});

                if (stream) {
                    for await (const chunk of await chat.stream(input)) {
                        yield* next({output: 'out', results: {result: chunk.content}});
                    }
                    return;
                }
                yield* next({output: 'out', results: {result: (await chat.invoke(input, {signal})).content}});
                return;
            }
            case 'mistral': {
                const {ChatMistralAI} = await import('@langchain/mistralai');
                const {url, model, apiKey} = config.provider.settings;
                const chat = new ChatMistralAI({endpoint: url, model, apiKey});

                if (stream) {
                    for await (const chunk of await chat.stream(input)) {
                        yield* next({output: 'out', results: {result: chunk.content}});
                    }
                    return;
                }
                yield* next({output: 'out', results: {result: (await chat.invoke(input, {tools: [], signal})).content}});
                return;
            }
        }
    },
});
