import {createClient} from '@supabase/supabase-js';

import {serverAction} from '$lib/core/plugins/action.server';
import type action from './createUser';

export default serverAction<typeof action>({
    exec: async function* ({next, config}) {
        const {url, key, email, password} = config;

        const client = createClient(url, key);
        const response = await client.auth.admin.createUser({email, password, email_confirm: true});
        if (response.error) throw response.error;

        yield* next({output: 'out', results: {userId: response.data.user.id}});
    },
});
