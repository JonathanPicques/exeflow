import type {JsonSchema} from '$lib/schema/schema';

export interface Trigger<Config> {
    type: 'trigger';
    //
    icon: string;
    title: string;
    description: string;
    //
    form: (args: FormArgs<Config>) => JsonSchema | Promise<JsonSchema>;
    config: (args: ConfigArgs<Config>) => ConfigResult<Config> | Promise<ConfigResult<Config>>;
}

export type TriggerId = string;

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
    outputs: string[];
    results: Record<string, JsonSchema>;
}

export const trigger = <Config>(trigger: Omit<Trigger<Config>, 'type'>) => ({type: 'trigger', ...trigger});
