import action from './embeddings';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({config}) {
        const {input} = config;

        switch (config.provider.type) {
            case 'ollama': {
                const {OllamaEmbeddings} = await import('@langchain/ollama');
                const {url, model} = config.provider.settings;
                const embeddings = new OllamaEmbeddings({baseUrl: url, model});
                const vectors = await embeddings.embedDocuments([input]);

                return {out: 'out', results: {result: vectors}};
            }
            case 'openai': {
                const {OpenAIEmbeddings} = await import('@langchain/openai');
                const {model, apiKey} = config.provider.settings;
                const embeddings = new OpenAIEmbeddings({model, apiKey});
                const vectors = await embeddings.embedDocuments([input]);

                return {out: 'out', results: {result: vectors}};
            }
            case 'mistral': {
                const {MistralAIEmbeddings} = await import('@langchain/mistralai');
                const {url, model, apiKey} = config.provider.settings;
                const embeddings = new MistralAIEmbeddings({endpoint: url, model, apiKey});
                const vectors = await embeddings.embedDocuments([input]);

                return {out: 'out', results: {result: vectors}};
            }
        }
    },
});
