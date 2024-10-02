import icon from './+icon.svg';
import {trigger} from '$lib/core/plugins/trigger';
import type {JsonSchema} from '$lib/schema/schema';
import {fill} from '$lib/schema/data';

const configSchema = {
    type: 'object',
    required: ['token', 'server', 'channel'] as const,
    properties: {
        token: {type: 'string', description: 'guide to create a discord bot token: https://discord.com/developers/docs/quick-start/getting-started'},
        server: {type: 'string', description: 'will be sent on this server'},
        channel: {type: 'string', description: 'will be sent on this channel'},
    },
} satisfies JsonSchema;

export default trigger<typeof configSchema>({
    icon,
    color: '#7289da',
    description: 'triggered when receiving a message in a channel',
    //
    form({config}) {
        return fill(configSchema, config);
    },
    data({form, config}) {
        return {
            valid: true,
            title: 'receive message',
            config: {
                value: {
                    token: form?.token ?? config?.token ?? '',
                    server: form?.server ?? config?.server ?? '',
                    channel: form?.channel ?? config?.channel ?? '',
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
