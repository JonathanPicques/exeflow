import icon from '$lib/plugins/icons/mistral.svg';
import {action} from '$lib/plugins/@action';

export default action({
    icon,
    color: '#fecd00',
    description: 'generate embeddings',
    //
    form(args) {
        throw new Error('not implemented');
    },
    data(args) {
        throw new Error('not implemented');
    },
});