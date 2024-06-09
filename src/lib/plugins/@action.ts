import type {JsonSchema} from '$lib/schema/schema';

export type ActionId = string;

export interface Action<Config> {
    type: 'action';
    //
    icon: string;
    color: string;
    description: string;
    //
    form: (args: FormArgs<Config>) => JsonSchema | Promise<JsonSchema>;
    data: (args: DataArgs<Config>) => ActionData<Config> | Promise<ActionData<Config>>;
    exec: (args: ExecArgs<Config>) => Generator<ActionExecStep, ActionExecStep> | AsyncGenerator<ActionExecStep, ActionExecStep>;
}

export interface ActionData<Config> {
    valid: boolean;
    title?: string;
    config: Config;
    inputs: string[];
    outputs: string[];
    results: Record<string, JsonSchema>;
}

export interface ActionExecStep {
    out: string | undefined;
    results: Record<string, unknown>;
}

interface FormArgs<Config> {
    config: Config;
}

interface DataArgs<Config> {
    form?: unknown;
    config?: Config;
}

interface ExecArgs<Config> {
    config: Config;
}

export const action = <Config>(action: Omit<Action<Config>, 'type'>) => ({type: 'action', ...action});
