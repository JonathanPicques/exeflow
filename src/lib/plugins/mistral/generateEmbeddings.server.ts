import MistralClient from '@mistralai/mistralai';

import action from './generateEmbeddings';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({config}) {
        const {url, model, input, apiKey} = config;

        const client = new MistralClient(apiKey, url);
        const response = await client.embeddings({
            model,
            input,
        });
        return {out: 'out', results: {embeddings: response.data[0].embedding}};
    },
});
