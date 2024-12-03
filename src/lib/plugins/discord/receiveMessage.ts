import icon from './+icon.svg';
import {trigger} from '$lib/core/plugins/trigger';
import {fill, zero} from '$lib/core/plugins/config/data';
import type {JsonSchema} from '$lib/core/schema/schema';

const configSchema = {
    type: 'object',
    required: ['token', 'channel'] as const,
    properties: {
        token: {
            type: 'string',
            default: '${secret:DISCORD_TOKEN}',
            description: 'guide to create a discord bot and get the token: https://discord.com/developers/docs/quick-start/getting-started',
        },
        channel: {
            type: 'string',
            default: '${secret:DISCORD_CHANNEL}',
            description: `enable developer mode, and right click a channel to copy the channel id`,
        },
    },
    additionalProperties: false,
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
            config: {
                value: {
                    token: form?.token ?? config?.token ?? zero(configSchema.properties.token),
                    channel: form?.channel ?? config?.channel ?? zero(configSchema.properties.channel),
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
