import icon from '$lib/plugins/icons/discord.svg';
import {trigger} from '$lib/plugins/@trigger';

interface Config {
    token: string;
    server: string;
    channel: string;
}

export default trigger<Config>({
    icon,
    color: '#7289da',
    description: 'triggered when receiving a message in a channel',
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
            },
        };
    },
    data({form, config}) {
        const f = form as Partial<Config> | undefined;

        return {
            valid: true,
            title: 'receive message',
            config: {
                token: f?.token ?? config?.token ?? 'sk-abc-123',
                server: f?.server ?? config?.server ?? 'sk-abc-123',
                channel: f?.channel ?? config?.channel ?? 'sk-abc-123',
            },
            outputs: ['out'],
            results: {
                author: {type: 'string'},
                message: {type: 'string'},
            },
        };
    },
});
