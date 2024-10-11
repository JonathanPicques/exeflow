import {serverAction} from '$lib/core/plugins/action.server';
import type action from './print';

export default serverAction<typeof action>({
    exec: async function* ({next, config}) {
        console.log(config.text);
        yield* next({output: 'out', results: {}});
    },
});
