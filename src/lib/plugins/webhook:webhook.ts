import {trigger, type TriggerSignature} from '$lib/graph/trigger';

interface Config {}

interface Signature extends TriggerSignature {
    outputs: ['out'];
    //
    returns: {
        order: ['body'];
        values: {
            body: {type: 'string'};
        };
    };
}

export default trigger<Config, Signature>({
    icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/webhook.svg',
    title: 'webhook',
    description: 'runs a scenario when called via HTTP(s)',
    //
    config() {
        return {valid: true, config: {}};
    },
    renderForm() {
        return {
            type: 'string',
            const: 'http://my.app.webhook.com',
        };
    },
    renderNode() {
        return {
            outputs: ['out'],
            returns: {
                order: ['body'],
                values: {
                    body: {type: 'string'},
                },
            },
        };
    },
});
