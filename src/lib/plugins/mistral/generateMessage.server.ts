import action from './generateMessage';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: function* () {
        return {out: 'out', results: {message: 'sample result from mistral'}};
    },
});
