import {createClient} from '@supabase/supabase-js';

import action from './createUser';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({config}) {
        const {url, key, email, password} = config;

        const client = createClient(url, key);
        const response = await client.auth.admin.createUser({email, password, email_confirm: true});
        if (response.error) throw response.error;

        return {out: 'out', results: {userId: response.data.user.id}};
    },
});
