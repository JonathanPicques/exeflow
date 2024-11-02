import {makeUrl} from '$lib/core/helper/makeurl';
import {serverAction} from '$lib/core/plugins/action.server';
import type action from './http';

export default serverAction<typeof action>({
    exec: async function* ({next, config: {url, body, method, search, headers}}) {
        const response = await fetch(makeUrl(url, search as Record<string, string>), {body, method, headers: headers as Record<string, string>});

        yield* next({
            output: 'out',
            results: {
                body: await response.text(),
                status: response.status,
                headers: JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2),
            },
        });
    },
});
