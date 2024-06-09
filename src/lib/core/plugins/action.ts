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

export const action = <Config>(action: Omit<Action<Config>, 'type'>): Action<Config> => ({type: 'action', ...action});
