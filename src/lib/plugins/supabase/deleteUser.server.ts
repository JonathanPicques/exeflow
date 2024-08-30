import {createClient} from '@supabase/supabase-js';

import action from './deleteUser';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({next, config}) {
        const {url, key, userId} = config;

        const client = createClient(url, key);
        const response = await client.auth.admin.deleteUser(userId);
        if (response.error) throw response.error;

        yield* next({output: 'out', results: {}});
    },
});
