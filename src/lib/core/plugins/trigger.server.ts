import type {Trigger} from '$lib/core/plugins/trigger';

export interface ServerTrigger<Config> {
    type: 'serverTrigger';
    //
    exec: (args: ExecArgs<Config>) => Generator<ExecStep, ExecStep> | AsyncGenerator<ExecStep, ExecStep>;
}

interface ExecArgs<Config> {
    config: Config;
}

interface ExecStep {
    out: string | undefined;
    results: Record<string, unknown>;
}

export const serverTrigger = <Config>(_: Trigger<Config>, serverTrigger: Omit<ServerTrigger<Config>, 'type'>): ServerTrigger<Config> => ({type: 'serverTrigger', ...serverTrigger});
