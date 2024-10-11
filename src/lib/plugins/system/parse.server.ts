import {serverAction} from '$lib/core/plugins/action.server';
import type action from './parse';

export default serverAction<typeof action>({
    exec: async function* ({next, config}) {
        yield* next({
            output: 'out',
            results: {
                json: JSON.parse(config.json),
            },
        });
    },
});
