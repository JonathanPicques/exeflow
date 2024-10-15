import {valid} from '$lib/schema/validate';
import {serverAction} from '$lib/core/plugins/action.server';
import type action from './sendMessage';

export default serverAction<typeof action>({
    exec: async function* ({next, config: {token, channel, message}}) {
        const response = await fetch(`https://discord.com/api/v10/channels/${channel}/messages`, {
            body: JSON.stringify({content: message}),
            method: 'POST',
            headers: {
                Authorization: `Bot ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.status < 200 || response.status > 299) throw new Error(await response.text());

        const sentMessage = await response.json();
        if (!valid(sentMessage, {type: 'object', required: ['id'], properties: {id: {type: 'string'}}})) throw new Error('message is missing required field id: ', sentMessage);

        yield* next({output: 'out', results: {id: sentMessage.id}});
    },
});
