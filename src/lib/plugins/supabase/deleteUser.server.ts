import {createClient} from '@supabase/supabase-js';

import {serverAction} from '$lib/core/plugins/action.server';
import type action from './deleteUser';

export default serverAction<typeof action>({
    exec: async function* ({next, config}) {
        const {url, key, userId} = config;

        const client = createClient(url, key);
        const response = await client.auth.admin.deleteUser(userId);
        if (response.error) throw response.error;

        yield* next({output: 'out', results: {}});
    },
});
