import type {Trigger} from '$lib/core/plugins/trigger';
import type {JsonSchema} from '$lib/core/schema/schema';
import type {InferJsonSchema} from '$lib/core/schema/infer';
import type {PluginId, PluginNode} from '$lib/core/core';

export interface ServerTrigger<Config extends JsonSchema> {
    type: 'serverTrigger';
    //
    exec: (args: ExecArgs<Config>) => AsyncGenerator<ExecStep>;
}

interface ExecArgs<Config extends JsonSchema> {
    next: (args: ExecNext) => AsyncGenerator<ExecStep>;
    config: InferJsonSchema<Config>;
    signal: AbortSignal;
    request?: Request;
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

type GetConfig<T extends Trigger<JsonSchema>> = T extends Trigger<infer Config> ? Config : JsonSchema;
export const serverTrigger = <T extends Trigger<JsonSchema>>(serverTrigger: Omit<ServerTrigger<GetConfig<T>>, 'type'>): ServerTrigger<GetConfig<T>> => ({
    type: 'serverTrigger',
    ...serverTrigger,
});
