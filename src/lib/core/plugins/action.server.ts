import type {Action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';
import type {InferJsonSchema} from '$lib/schema/infer';
import type {PluginId, PluginNode} from '$lib/core/core';

export interface ServerAction<Config extends JsonSchema> {
    type: 'serverAction';
    //
    exec: (args: ExecArgs<Config>) => AsyncGenerator<ExecStep>;
}

interface ExecArgs<Config extends JsonSchema> {
    next: (args: ExecNext) => AsyncGenerator<ExecStep>;
    input: string;
    config: InferJsonSchema<Config>;
    signal: AbortSignal;
}

interface ExecNext {
    output: string;
    results: Record<string, unknown>;
}

interface ExecStep {
    nodeId: PluginNode['id'];
    pluginId: PluginId;
    //
    config: unknown;
    results: Record<string, unknown>;
}

type GetConfig<T extends Action<JsonSchema>> = T extends Action<infer Config> ? Config : JsonSchema;
export const serverAction = <T extends Action<JsonSchema>>(serverAction: Omit<ServerAction<GetConfig<T>>, 'type'>): ServerAction<GetConfig<T>> => ({
    type: 'serverAction',
    ...serverAction,
});
