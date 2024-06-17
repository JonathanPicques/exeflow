import type {PluginId} from '$lib/core/core';
import type {JsonSchema} from '$lib/schema/schema';
import type {ServerAction} from '$lib/core/plugins/action.server';
import type {ServerTrigger} from '$lib/core/plugins/trigger.server';
import type {Action, ActionId} from '$lib/core/plugins/action';
import type {Trigger, TriggerId} from '$lib/core/plugins/trigger';

/**
 * Returns all plugins (actions and triggers) from the $lib/plugins directory
 */
export const loadPlugins = async () => {
    const actions: Record<ActionId, Action<JsonSchema>> = {};
    const triggers: Record<TriggerId, Trigger<JsonSchema>> = {};
    const pluginModules = import.meta.glob('$lib/plugins/**/*.ts');

    for (const [path, module] of Object.entries(pluginModules)) {
        if (path.endsWith('.server.ts')) continue;

        const id = path.replace('/src/lib/plugins/', '').replace('/', ':').replace('.ts', '');
        const plugin = ((await module()) as {default: Action<JsonSchema> | Trigger<JsonSchema>}).default;

        switch (plugin.type) {
            case 'action':
                actions[id] = plugin;
                break;
            case 'trigger':
                triggers[id] = plugin;
                break;
            default:
                throw new Error(`malformed plugin ${id}`);
        }
    }
    return {actions, triggers};
};

/**
 * Returns all server plugins (server actions and server triggers) from the $lib/plugins directory
 */
export const loadServerPlugins = async () => {
    const actions: Record<ActionId, ServerAction<JsonSchema>> = {};
    const triggers: Record<TriggerId, ServerTrigger<JsonSchema>> = {};
    const pluginModules = import.meta.glob('$lib/plugins/**/*.server.ts');

    for (const [path, module] of Object.entries(pluginModules)) {
        const id = path.replace('/src/lib/plugins/', '').replace('/', ':').replace('.server.ts', '');
        const plugin = ((await module()) as {default: ServerAction<JsonSchema> | ServerTrigger<JsonSchema>}).default;

        switch (plugin.type) {
            case 'serverAction':
                actions[id] = plugin;
                break;
            case 'serverTrigger':
                triggers[id] = plugin;
                break;
            default:
                throw new Error(`malformed server plugin ${id}`);
        }
    }
    return {actions, triggers};
};

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
