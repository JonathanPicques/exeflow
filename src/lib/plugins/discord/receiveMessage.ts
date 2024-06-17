import icon from './icon.svg';
import {trigger} from '$lib/core/plugins/trigger';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['token', 'server', 'channel'] as const,
    properties: {
        token: {type: 'string'},
        server: {type: 'string'},
        channel: {type: 'string'},
    },
} satisfies JsonSchema;

export default trigger<typeof configSchema>({
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
        return {
            valid: true,
            title: 'receive message',
            config: {
                value: {
                    token: form?.token ?? config?.token ?? 'sk-abc-123',
                    server: form?.server ?? config?.server ?? 'sk-abc-123',
                    channel: form?.channel ?? config?.channel ?? 'sk-abc-123',
                },
                schema: configSchema,
            },
            outputs: ['out'],
            results: {
                author: {type: 'string'},
                message: {type: 'string'},
            },
        };
    },
});
