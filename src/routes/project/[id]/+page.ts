import {error} from '@sveltejs/kit';
import type {Action, ActionId} from '$lib/plugins/@action';
import type {Trigger, TriggerId} from '$lib/plugins/@trigger';

export const load = async ({data}) => {
    const actions: Record<ActionId, Action<unknown>> = {};
    const triggers: Record<TriggerId, Trigger<unknown>> = {};
    const pluginModules = import.meta.glob('$lib/plugins/*');

    for (const [path, module] of Object.entries(pluginModules)) {
        const id = path.replace('/src/lib/plugins/', '').replace('.ts', '');

        if (id !== '@action' && id !== '@trigger') {
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
    }

    return {
        project: data.project,
        actions,
        triggers,
    };
};
