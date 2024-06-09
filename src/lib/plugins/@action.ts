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
    exec: (args: ExecArgs<Config>) => Generator<ExecResult, ExecResult> | AsyncGenerator<ExecResult, ExecResult>;
}

export interface ActionData<Config> {
    valid: boolean;
    title?: string;
    config: Config;
    inputs: string[];
    outputs: string[];
    results: Record<string, JsonSchema>;
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

interface ExecResult {
    out: string | undefined;
    results: Record<string, unknown>;
}

export const action = <Config>(action: Omit<Action<Config>, 'type'>) => ({type: 'action', ...action});
