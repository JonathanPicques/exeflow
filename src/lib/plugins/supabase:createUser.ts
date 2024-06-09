import icon from '$lib/plugins/icons/supabase.svg';
import {action} from '$lib/plugins/@action';

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
    exec: function* (args) {
        throw new Error('not implemented');
    },
});
