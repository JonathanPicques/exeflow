import type {JsonSchema} from '$lib/schema/schema';

export interface Action<Config> {
    type: 'action';
    //
    icon: string;
    title: string;
    description: string;
    //
    form: (args: FormArgs<Config>) => JsonSchema | Promise<JsonSchema>;
    config: (args: ConfigArgs<Config>) => ConfigResult<Config> | Promise<ConfigResult<Config>>;
}

export type ActionId = string;

interface FormArgs<Config> {
    config: Config;
}

interface ConfigArgs<Config> {
    form?: unknown;
    config?: Config;
}

interface ConfigResult<Config> {
    valid: boolean;
    config: Config;
    inputs: string[];
    outputs: string[];
    results: Record<string, JsonSchema>;
}

export const action = <Config>(action: Omit<Action<Config>, 'type'>) => ({type: 'action', ...action});
