import action from './print';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: function* ({config}) {
        console.log(config.text);
        return {out: 'out', results: {}};
    },
});
