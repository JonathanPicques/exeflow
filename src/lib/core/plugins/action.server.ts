import type {Action} from '$lib/core/plugins/action';
import type {PluginId} from '$lib/core/core';
import type {JsonSchema} from '$lib/schema/schema';
import type {PluginNode} from '$lib/core/graph/nodes';
import type {InferJsonSchema} from '$lib/schema/infer';

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

export const serverAction = <Config extends JsonSchema>(_: Action<Config>, serverAction: Omit<ServerAction<Config>, 'type'>): ServerAction<Config> => ({
    type: 'serverAction',
    ...serverAction,
});
