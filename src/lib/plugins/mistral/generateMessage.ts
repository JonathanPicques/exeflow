import icon from '$lib/plugins/mistral/icon.svg';
import {action} from '$lib/core/plugins/action';

export default action({
    icon,
    color: '#fecd00',
    description: 'generate a message using a llm',
    //
    form(args) {
        throw new Error('not implemented');
    },
    data(args) {
        throw new Error('not implemented');
    },
});