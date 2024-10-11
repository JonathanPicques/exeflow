import trigger from './cron';
import {serverTrigger} from '$lib/core/plugins/trigger.server';

export default serverTrigger<typeof trigger>({
    exec: async function* ({next}) {
        yield* next({output: 'out', results: {}});
    },
});
