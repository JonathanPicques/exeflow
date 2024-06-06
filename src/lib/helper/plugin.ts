import type {PluginId} from '$lib/graph/data';

/**
 * Returns an eye pleasing human readable string from the given plugin name
 * @example
 * ```ts
 * humanPluginName('sendMessage') => 'send message'
 * ```
 */
export const humanPluginName = (name: string) => {
    return name.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
};

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
