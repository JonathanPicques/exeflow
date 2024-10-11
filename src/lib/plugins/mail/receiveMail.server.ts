import {serverTrigger} from '$lib/core/plugins/trigger.server';
import type trigger from './receiveMail';

export default serverTrigger<typeof trigger>({
    exec: async function* ({next}) {
        yield* next({output: 'out', results: {}});
    },
});
