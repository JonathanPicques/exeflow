import {trigger, type TriggerSignature} from './@trigger';

interface Config {}

interface Signature extends TriggerSignature {
    outputs: ['out'];
    //
    returns: {
        order: ['message'];
        values: {
            message: {type: 'string'};
        };
    };
}

export default trigger<Config, Signature>({
    icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/discord.svg',
    title: 'receive message',
    description: 'receive a message from a discord channel',
    //
    config() {
        return {valid: true, config: {}};
    },
    renderForm() {
        return {};
    },
    renderNode() {
        return {
            outputs: ['out'],
            returns: {
                order: ['message'],
                values: {
                    message: {type: 'string'},
                },
            },
        };
    },
});
