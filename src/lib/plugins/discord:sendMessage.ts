import {action, type ActionSignature} from '../api/action';

interface Config {
    token: string;
    server: string;
    channel: string;
}

interface Signature extends ActionSignature {
    inputs: ['in'];
    outputs: ['out', 'on error'];
    //
    params: {
        order: ['message'];
        values: {
            message: {type: 'string'};
        };
    };
    returns: {
        order: ['error'];
        values: {
            error: {type: 'string'};
        };
    };
}

export default action<Config, Signature>({
    icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/discord.svg',
    title: 'send message',
    description: 'send a message in a discord channel',
    //
    config({form, config}) {
        const typedForm = form as Partial<Config> | undefined;

        return {
            valid: true,
            config: {
                token: typedForm?.token ?? config?.token ?? 'sk-abc-123',
                server: typedForm?.server ?? config?.server ?? 'sk-abc-123',
                channel: typedForm?.channel ?? config?.channel ?? 'sk-abc-123',
            },
        };
    },
    renderForm({config}) {
        return {
            type: 'object',
            required: ['token', 'server', 'channel'],
            properties: {
                token: {
                    type: 'string',
                    default: config.token,
                    //
                    title: 'Discord bot token',
                    description: 'You discord bot token can be found here: https://acme.com/api-key',
                },
                server: {
                    type: 'string',
                    default: config.server,
                },
                channel: {
                    type: 'string',
                    default: config.channel,
                },
            },
        };
    },
    renderNode() {
        return {
            inputs: ['in'],
            outputs: ['out', 'on error'],
            params: {
                order: ['message'],
                values: {
                    message: {type: 'string'},
                },
            },
            returns: {
                order: ['error'],
                values: {error: {type: 'string'}},
            },
        };
    },
});
