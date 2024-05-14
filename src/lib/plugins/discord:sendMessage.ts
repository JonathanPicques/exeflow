import {action} from './@action';

interface Config {
    token: string;
    server: string;
    channel: string;
}

export default action<Config>({
    icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/discord.svg',
    color: '#7289da',
    title: 'send message',
    description: 'send a message in a discord channel',
    //
    form({config}) {
        return {
            type: 'object',
            required: ['token', 'server', 'channel'],
            properties: {
                token: {
                    type: 'string',
                    default: config.token,
                    //
                    description: 'You discord bot token can be found here: https://acme.com/api-key',
                },
                server: {
                    type: 'string',
                    default: config.server,
                    //
                    description: 'The message will be sent on this server',
                },
                channel: {
                    type: 'string',
                    default: config.channel,
                    //
                    description: 'The message will be sent on this channel',
                },
            },
        };
    },
    data({form, config}) {
        const typedForm = form as Partial<Config> | undefined;

        return {
            valid: true,
            config: {
                token: typedForm?.token ?? config?.token ?? 'sk-abc-123',
                server: typedForm?.server ?? config?.server ?? 'sk-abc-123',
                channel: typedForm?.channel ?? config?.channel ?? 'sk-abc-123',
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                error: {type: 'string'},
            },
        };
    },
});
