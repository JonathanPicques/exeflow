import {serverAction} from '$lib/core/plugins/action.server';
import type action from './http';

export default serverAction<typeof action>({
    exec: async function* ({next, config: {url, method, headers}}) {
        const response = await fetch(url, {method, headers: JSON.parse(headers)});

        yield* next({
            output: 'out',
            results: {
                text: await response.text(),
                status: response.status,
                headers: JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2),
            },
        });
    },
});
