import icon from './+icon.svg';
import {action} from '$lib/core/plugins/action';
import {fill, zero} from '$lib/schema/data';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    required: ['token', 'channel', 'message'] as const,
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
        message: {
            type: 'string',
            default: 'Hello from Exeflow!',
        },
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#7289da',
    description: 'send a message in a channel',
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
                    message: form?.message ?? config?.message ?? zero(configSchema.properties.message),
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {
                id: {type: 'string'},
            },
        };
    },
});
