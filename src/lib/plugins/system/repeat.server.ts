import {serverAction} from '$lib/core/plugins/action.server';
import type action from './repeat';

export default serverAction<typeof action>({
    exec: async function* ({next, config}) {
        for (let i = 0; i < config.count; i++) {
            yield* next({output: 'out', results: {index: i}});
        }
    },
});
