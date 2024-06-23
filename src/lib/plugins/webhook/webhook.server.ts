import trigger from './webhook';
import {tryFunction} from '$lib/helper/error';
import {serverTrigger} from '$lib/core/plugins/trigger.server';

export default serverTrigger(trigger, {
    exec: async function* ({request}) {
        const body = await tryFunction(async () => await request?.text());
        return {out: 'out', results: {body}};
    },
});
