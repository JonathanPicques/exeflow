import {tryFunction} from '$lib/helper/function';
import {serverTrigger} from '$lib/core/plugins/trigger.server';
import type trigger from './webhook';

export default serverTrigger<typeof trigger>({
    exec: async function* ({next, request}) {
        yield* next({
            output: 'out',
            results: {
                body: await tryFunction(async () => await request?.text()),
                search: request?.url ? Object.fromEntries(new URL(request.url).searchParams.entries()) : {},
                headers: request?.headers ? Object.fromEntries(request.headers.entries()) : {},
            },
        });
    },
});
