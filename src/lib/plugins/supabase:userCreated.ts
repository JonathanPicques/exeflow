import icon from '$lib/plugins/icons/supabase.svg';
import {trigger} from '$lib/plugins/@trigger';

export default trigger({
    icon,
    color: '#3ecf8e',
    description: 'triggered when a new user is created',
    //
    form(args) {
        throw new Error('not implemented');
    },
    data(args) {
        throw new Error('not implemented');
    },
});
