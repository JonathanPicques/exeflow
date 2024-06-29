import type {Action} from '$lib/core/plugins/action';
import type {JsonSchema, InferJsonSchema} from '$lib/schema/schema';

export interface ServerAction<Config extends JsonSchema> {
    type: 'serverAction';
    //
    exec: (args: ExecArgs<Config>) => Generator<ExecStep, ExecStep> | AsyncGenerator<ExecStep, ExecStep>;
}

interface ExecArgs<Config extends JsonSchema> {
    config: InferJsonSchema<Config>;
    signal: AbortSignal;
}

interface ExecStep {
    out: string | undefined;
    results: Record<string, unknown>;
}

export const serverAction = <Config extends JsonSchema>(_: Action<Config>, serverAction: Omit<ServerAction<Config>, 'type'>): ServerAction<Config> => ({
    type: 'serverAction',
    ...serverAction,
});
