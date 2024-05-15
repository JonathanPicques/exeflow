import type {ActionId} from '$lib/plugins/@action';
import type {TriggerId} from '$lib/plugins/@trigger';

/**
 * Extracts the name from the given plugin id
 * @example
 * ```ts
 * extractPluginName('discord:sendMessage') => 'sendMessage'
 * ```
 */
export const extractPluginName = (id: ActionId | TriggerId) => {
    return id.split(':').slice(1).join('');
};

/**
 * Extracts the namespace from the given plugin id
 * @example
 * ```ts
 * extractPluginNamespace('discord:sendMessage') => 'discord'
 * ```
 */
export const extractPluginNamespace = (id: ActionId | TriggerId) => {
    return id.split(':')[0];
};
