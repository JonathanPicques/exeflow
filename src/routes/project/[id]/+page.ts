import {error} from '@sveltejs/kit';
import type {Action} from '$lib/api/action';
import type {Trigger} from '$lib/api/trigger';

export async function load({data}) {
    const actions: Record<string, Action<unknown>> = {};
    const triggers: Record<string, Trigger<unknown>> = {};
    const pluginModules = import.meta.glob('$lib/plugins/*');

    for (const [path, module] of Object.entries(pluginModules)) {
        const id = path.replace('/src/lib/plugins/', '').replace('.ts', '');
        const plugin = ((await module()) as {default: Action<unknown> | Trigger<unknown>}).default;

        switch (plugin.type) {
            case 'action':
                actions[id] = plugin;
                break;
            case 'trigger':
                triggers[id] = plugin;
                break;
            default:
                throw error(500, `malformed plugin`);
        }
    }

    return {
        project: data.project,
        actions,
        triggers,
    };
}
