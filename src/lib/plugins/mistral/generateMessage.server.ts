import {Mistral} from '@mistralai/mistralai';

import action from './generateMessage';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({config}) {
        const {url, model, prompt, apiKey} = config;

        const client = new Mistral({apiKey, serverURL: url});
        const response = await client.chat.complete({
            model,
            messages: [{role: 'user', content: prompt}],
        });
        return {out: 'out', results: {message: response.choices?.[0]?.message?.content}};
    },
});
