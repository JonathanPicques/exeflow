import {serverAction} from '$lib/core/plugins/action.server';
import type action from './response';

export default serverAction<typeof action>({
    exec: async function* ({next}) {
        yield* next({output: 'out', results: {}});
    },
});
