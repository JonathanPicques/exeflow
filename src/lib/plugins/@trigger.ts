import type {JsonSchema} from '$lib/schema/schema';

export type TriggerId = string;

export interface Trigger<Config> {
    type: 'trigger';
    //
    icon: string;
    color: string;
    description: string;
    //
    form: (args: FormArgs<Config>) => JsonSchema | Promise<JsonSchema>;
    data: (args: DataArgs<Config>) => TriggerData<Config> | Promise<TriggerData<Config>>;
}

export interface TriggerData<Config> {
    valid: boolean;
    title?: string;
    config: Config;
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

export const trigger = <Config>(trigger: Omit<Trigger<Config>, 'type'>) => ({type: 'trigger', ...trigger});
