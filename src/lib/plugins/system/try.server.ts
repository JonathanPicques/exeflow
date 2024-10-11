import {serverAction} from '$lib/core/plugins/action.server';
import type action from './try';

export default serverAction<typeof action>({
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
