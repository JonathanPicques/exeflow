import action from './completion';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({next, config, signal}) {
        const {input} = config;

        switch (config.provider.type) {
            case 'ollama': {
                const {ChatOllama} = await import('@langchain/ollama');
                const {url, model} = config.provider.settings;
                const chat = new ChatOllama({baseUrl: url, model});
                const {content} = await chat.invoke(input, {signal});

                yield* next({output: 'out', results: {result: content}});
                break;
            }
            case 'openai': {
                const {ChatOpenAI} = await import('@langchain/openai');
                const {model, apiKey} = config.provider.settings;
                const chat = new ChatOpenAI({model, apiKey});
                const {content} = await chat.invoke(input, {signal});

                yield* next({output: 'out', results: {result: content}});
                break;
            }
            case 'mistral': {
                const {ChatMistralAI} = await import('@langchain/mistralai');
                const {url, model, apiKey} = config.provider.settings;
                const chat = new ChatMistralAI({endpoint: url, model, apiKey});
                const {content} = await chat.invoke(input, {tools: [], signal});

                yield* next({output: 'out', results: {result: content}});
                break;
            }
        }
    },
});
