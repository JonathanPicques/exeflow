import {valid} from '$lib/schema/validate';
import {serverAction} from '$lib/core/plugins/action.server';
import type action from './parseJSON';

export default serverAction<typeof action>({
    exec: async function* ({next, config}) {
        const json = JSON.parse(config.text);
        if (!valid(json, config.schema)) throw new Error(`cannot validate ${config.text} against json schema ${JSON.stringify(config.schema, null, 2)}`);

        yield* next({
            output: 'out',
            results: {json},
        });
    },
});
