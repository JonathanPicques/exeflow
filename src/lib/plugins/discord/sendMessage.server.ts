import sendMessage from './sendMessage';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(sendMessage, {
    exec: function* ({config}) {
        console.log(config);
        return {out: 'out', results: {}};
    },
});
