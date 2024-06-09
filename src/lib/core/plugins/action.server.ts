import type {Action} from '$lib/core/plugins/action';

export interface ServerAction<Config> {
    type: 'serverAction';
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

export const serverAction = <Config>(_: Action<Config>, serverAction: Omit<ServerAction<Config>, 'type'>): ServerAction<Config> => ({type: 'serverAction', ...serverAction});
