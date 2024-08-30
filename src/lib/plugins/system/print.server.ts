import action from './print';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({next, config}) {
        console.log(config.text);
        yield* next({output: 'out', results: {}});
    },
});
