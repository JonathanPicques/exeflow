import {serverAction} from '$lib/core/plugins/action.server';
import type action from './header';

export default serverAction<typeof action>({
    exec: async function* ({next}) {
        yield* next({output: 'out', results: {}});
    },
});
