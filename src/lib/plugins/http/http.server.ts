import action from './http';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
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
