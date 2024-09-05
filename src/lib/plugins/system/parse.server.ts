import action from './parse';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({next, config}) {
        yield* next({
            output: 'out',
            results: {
                json: JSON.parse(config.json),
            },
        });
    },
});
