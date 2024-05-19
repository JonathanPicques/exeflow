import icon from '$lib/plugins/icons/discord.svg';
import {action} from '$lib/plugins/@action';

interface Config {
    token: string;
    server: string;
    channel: string;
    message: string;
}

export default action<Config>({
    icon,
    color: '#7289da',
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
                    description: 'the discord bot token can be found here: https://acme.com/api-key',
                },
                server: {
                    type: 'string',
                    default: config.server,
                    //
                    description: 'will be sent on this server',
                },
                channel: {
                    type: 'string',
                    default: config.channel,
                    //
                    description: 'will be sent on this channel',
                },
                message: {
                    type: 'string',
                    default: config.message,
                    //
                    description: 'message to send',
                },
            },
        };
    },
    data({form, config}) {
        const typedForm = form as Partial<Config> | undefined;

        return {
            valid: true,
            title: 'send message',
            config: {
                token: typedForm?.token ?? config?.token ?? 'sk-abc-123',
                server: typedForm?.server ?? config?.server ?? 'sk-abc-123',
                channel: typedForm?.channel ?? config?.channel ?? 'sk-abc-123',
                message: typedForm?.message ?? config?.message ?? '',
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                error: {type: 'string'},
            },
        };
    },
});
