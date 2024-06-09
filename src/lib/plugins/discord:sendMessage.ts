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
    description: 'send a message in a channel',
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
        const f = form as Partial<Config> | undefined;

        return {
            valid: true,
            title: 'send message',
            config: {
                token: f?.token ?? config?.token ?? 'sk-abc-123',
                server: f?.server ?? config?.server ?? 'sk-abc-123',
                channel: f?.channel ?? config?.channel ?? 'sk-abc-123',
                message: f?.message ?? config?.message ?? '',
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                error: {type: 'string'},
            },
        };
    },
    exec: function* (args) {
        console.log('discord:sendMessage', {args});
        return {out: 'out', results: {}};
    },
});
