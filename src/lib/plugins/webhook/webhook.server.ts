import trigger from './webhook';
import {tryFunction} from '$lib/helper/error';
import {serverTrigger} from '$lib/core/plugins/trigger.server';

export default serverTrigger(trigger, {
    exec: async function* ({next, request}) {
        const body = await tryFunction(async () => await request?.text());

        yield* next({output: 'out', results: {body}});
    },
});
