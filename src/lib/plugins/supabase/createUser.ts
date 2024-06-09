import icon from '$lib/plugins/supabase/icon.svg';
import {action} from '$lib/core/plugins/action';

export default action({
    icon,
    color: '#3ecf8e',
    description: 'create an user with email/password',
    //
    form(args) {
        throw new Error('not implemented');
    },
    data(args) {
        throw new Error('not implemented');
    },
});
