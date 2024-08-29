import action from './repeat';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: function* ({config}) {
        for (let i = 0; i < config.count; i++) {
            yield {out: 'out', results: {index: i}};
        }
    },
});
