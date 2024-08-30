import trigger from './receiveMessage';
import {serverTrigger} from '$lib/core/plugins/trigger.server';

export default serverTrigger(trigger, {
    exec: async function* ({next}) {
        yield* next({output: 'out', results: {}});
    },
});
