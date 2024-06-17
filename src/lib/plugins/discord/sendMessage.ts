import icon from './icon.svg';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['token', 'server', 'channel', 'message'] as const,
    properties: {
        token: {type: 'string'},
        server: {type: 'string'},
        channel: {type: 'string'},
        message: {type: 'string'},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#7289da',
    description: 'send a message in a channel',
    //
    form({config}) {
        return {
            type: 'object',
            required: ['token', 'server', 'channel', 'message'],
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
                    format: 'text',
                    default: config.message,
                    //
                    description: 'message to send',
                },
            },
        };
    },
    data({form, config}) {
        return {
            valid: true,
            title: 'send message',
            config: {
                value: {
                    token: form?.token ?? config?.token ?? 'sk-abc-123',
                    server: form?.server ?? config?.server ?? 'sk-abc-123',
                    channel: form?.channel ?? config?.channel ?? 'sk-abc-123',
                    message: form?.message ?? config?.message ?? '',
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                error: {type: 'string'},
            },
        };
    },
});
