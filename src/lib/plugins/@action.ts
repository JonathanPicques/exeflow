import type {JsonSchema} from '$lib/schema/schema';

export interface Action<Config> {
    type: 'action';
    //
    icon: string;
    title: string;
    description: string;
    //
    form: (args: FormArgs<Config>) => JsonSchema | Promise<JsonSchema>;
    data: (args: DataArgs<Config>) => ActionData<Config> | Promise<ActionData<Config>>;
}

export type ActionId = string;

interface FormArgs<Config> {
    config: Config;
}

interface DataArgs<Config> {
    form?: unknown;
    config?: Config;
}

export interface ActionData<Config> {
    valid: boolean;
    config: Config;
    inputs: string[];
    outputs: string[];
    results: Record<string, JsonSchema>;
}

export const action = <Config>(action: Omit<Action<Config>, 'type'>) => ({type: 'action', ...action});
