import MistralClient from '@mistralai/mistralai';

import action from './generateMessage';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({config}) {
        const {url, model, prompt, apiKey} = config;

        const client = new MistralClient(apiKey, url);
        const response = await client.chat({
            model,
            messages: [{role: 'user', content: prompt}],
        });
        return {out: 'out', results: {message: response.choices[0].message.content}};
    },
});
