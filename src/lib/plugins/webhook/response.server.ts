import action from './response';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({next}) {
        yield* next({output: 'out', results: {}});
    },
});
