import type {Action} from '$lib/core/plugins/action';

export interface ActionServer<Config> {
    type: 'actionServer';
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

export const actionServer = <Config>(_: Action<Config>, actionServer: Omit<ActionServer<Config>, 'type'>): ActionServer<Config> => ({type: 'actionServer', ...actionServer});
