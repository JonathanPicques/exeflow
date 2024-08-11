import {Mistral} from '@mistralai/mistralai';

import action from './generateEmbeddings';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({config}) {
        const {url, model, inputs, apiKey} = config;

        const client = new Mistral({apiKey, serverURL: url});
        const response = await client.embeddings.create({model, inputs});

        return {out: 'out', results: {embeddings: response.data[0].embedding}};
    },
});
