import action from './repeat';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({next}) {
        try {
            yield* next({
                output: 'try',
                results: {error: ''},
            });
        } catch (e) {
            yield* next({
                output: 'catch',
                results: {
                    error: e?.toString(),
                },
            });
        }
    },
});
