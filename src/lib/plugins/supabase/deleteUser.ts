import icon from './icon.svg';
import {action} from '$lib/core/plugins/action';

export default action({
    icon,
    color: '#3ecf8e',
    description: 'delete an user',
    //
    form(args) {
        throw new Error('not implemented');
    },
    data(args) {
        throw new Error('not implemented');
    },
});
