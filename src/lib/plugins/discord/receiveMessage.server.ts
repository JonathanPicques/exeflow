import trigger from './receiveMessage';
import {serverTrigger} from '$lib/core/plugins/trigger.server';

export default serverTrigger(trigger, {
    exec: function* () {
        return {out: 'out', results: {}};
    },
});
