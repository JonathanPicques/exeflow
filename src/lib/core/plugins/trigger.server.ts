import type {Trigger} from '$lib/core/plugins/trigger';
import type {JsonSchema} from '$lib/schema/schema';
import type {InferJsonSchema} from '$lib/schema/infer';

export interface ServerTrigger<Config extends JsonSchema> {
    type: 'serverTrigger';
    //
    exec: (args: ExecArgs<Config>) => Generator<ExecStep, ExecStep> | AsyncGenerator<ExecStep, ExecStep>;
}

interface ExecArgs<Config extends JsonSchema> {
    config: InferJsonSchema<Config>;
    signal: AbortSignal;
    request?: Request;
}

interface ExecStep {
    out: string | undefined;
    results: Record<string, unknown>;
}

export const serverTrigger = <Config extends JsonSchema>(_: Trigger<Config>, serverTrigger: Omit<ServerTrigger<Config>, 'type'>): ServerTrigger<Config> => ({
    type: 'serverTrigger',
    ...serverTrigger,
});
