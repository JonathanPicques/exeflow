import {trigger, type TriggerSignature} from './@trigger';

interface Config {
    exposeBody: boolean;
    exposeMethod: boolean;
    exposeHeaders: boolean;
}

interface Signature extends TriggerSignature {
    outputs: ['out'];
}

export default trigger<Config, Signature>({
    icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/webhook.svg',
    title: 'webhook',
    description: 'runs a scenario when called via HTTP(s)',
    //
    config({form, config}) {
        const typedForm = form as Partial<Config> | undefined;

        return {
            valid: true,
            config: {
                exposeBody: typedForm?.exposeBody ?? config?.exposeBody ?? true,
                exposeMethod: typedForm?.exposeMethod ?? config?.exposeMethod ?? false,
                exposeHeaders: typedForm?.exposeHeaders ?? config?.exposeHeaders ?? false,
            },
        };
    },
    renderForm() {
        return {
            type: 'object',
            properties: {
                url: {type: 'string', const: 'http://webhook.exeflow.com/some-id'},
                exposeBody: {type: 'boolean'},
                exposeMethod: {type: 'boolean'},
                exposeHeaders: {type: 'boolean'},
            },
        };
    },
    renderNode({config}) {
        const returns: Signature['returns'] = {order: [], values: {}};

        if (config.exposeBody) {
            returns.order.push('body');
            returns.values['body'] = {type: 'string'};
        }
        if (config.exposeMethod) {
            returns.order.push('method');
            returns.values['method'] = {type: 'string'};
        }
        if (config.exposeHeaders) {
            returns.order.push('headers');
            returns.values['headers'] = {type: 'object', additionalProperties: {type: 'string'}};
        }
        return {
            outputs: ['out'],
            returns,
        };
    },
});
