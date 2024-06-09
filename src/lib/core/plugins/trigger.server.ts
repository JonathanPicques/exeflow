import type {Trigger} from '$lib/core/plugins/trigger';

export interface TriggerServer<Config> {
    type: 'triggerServer';
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

export const triggerServer = <Config>(_: Trigger<Config>, TriggerServer: Omit<TriggerServer<Config>, 'type'>): TriggerServer<Config> => ({type: 'triggerServer', ...TriggerServer});
