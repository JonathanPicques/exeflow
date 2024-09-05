import trigger from './webhook';
import {tryFunction} from '$lib/helper/error';
import {serverTrigger} from '$lib/core/plugins/trigger.server';

export default serverTrigger(trigger, {
    exec: async function* ({next, request}) {
        yield* next({
            output: 'out',
            results: {
                body: await tryFunction(async () => await request?.text()),
                headers: request?.headers ? Object.fromEntries(request.headers.entries()) : {},
            },
        });
    },
});
