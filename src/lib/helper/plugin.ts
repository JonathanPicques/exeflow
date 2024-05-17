import type {PluginId} from '$lib/graph/data';

/**
 * Extracts the plugin name from the given plugin id
 * @example
 * ```ts
 * extractPluginName('discord:sendMessage') => 'sendMessage'
 * ```
 */
export const extractPluginName = (id: PluginId) => {
    return id.split(':').slice(1).join('');
};

/**
 * Extracts the plugin namespace from the given plugin id
 * @example
 * ```ts
 * extractPluginNamespace('discord:sendMessage') => 'discord'
 * ```
 */
export const extractPluginNamespace = (id: PluginId) => {
    return id.split(':')[0];
};
