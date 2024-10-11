import {serverAction} from '$lib/core/plugins/action.server';
import type action from './embeddings';

export default serverAction<typeof action>({
    exec: async function* ({next, config}) {
        const {input} = config;

        switch (config.provider.type) {
            case 'ollama': {
                const {OllamaEmbeddings} = await import('@langchain/ollama');
                const {url, model} = config.provider.settings;
                const embeddings = new OllamaEmbeddings({baseUrl: url, model});
                const vectors = await embeddings.embedQuery(input);

                yield* next({output: 'out', results: {result: vectors}});
                break;
            }
            case 'openai': {
                const {OpenAIEmbeddings} = await import('@langchain/openai');
                const {model, apiKey} = config.provider.settings;
                const embeddings = new OpenAIEmbeddings({model, apiKey});
                const vectors = await embeddings.embedQuery(input);

                yield* next({output: 'out', results: {result: vectors}});
                break;
            }
            case 'mistral': {
                const {MistralAIEmbeddings} = await import('@langchain/mistralai');
                const {url, model, apiKey} = config.provider.settings;
                const embeddings = new MistralAIEmbeddings({endpoint: url, model, apiKey});
                const vectors = await embeddings.embedQuery(input);

                yield* next({output: 'out', results: {result: vectors}});
                break;
            }
        }
    },
});
