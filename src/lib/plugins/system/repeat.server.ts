import action from './repeat';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({next, config}) {
        for (let i = 0; i < config.count; i++) {
            yield* next({output: 'out', results: {index: i}});
        }
    },
});
