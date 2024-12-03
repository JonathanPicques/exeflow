import type {JsonSchema} from '$lib/core/schema/schema';
import type {InferRootConfig} from '$lib/core/plugins/config/infer';

export type TriggerId = string;

export interface Trigger<Config extends JsonSchema> {
    type: 'trigger';
    //
    icon: string;
    name?: string;
    color: string;
    description: string;
    //
    form: (args: FormArgs<Config>) => JsonSchema | Promise<JsonSchema>;
    data: (args: DataArgs<Config>) => TriggerData<Config> | Promise<TriggerData<Config>>;
}

export interface TriggerData<Config extends JsonSchema> {
    valid: boolean;
    title?: string;
    config: {value: InferRootConfig<Config>; schema: Config};
    outputs: string[];
    results: Record<string, JsonSchema>;
}

interface FormArgs<Config extends JsonSchema> {
    config: InferRootConfig<Config>;
    //
    constant: <T>(config: T | {type: 'code'; code: string}) => config is T;
}

interface DataArgs<Config extends JsonSchema> {
    form?: Partial<InferRootConfig<Config>>;
    config?: InferRootConfig<Config>;
    //
    constant: <T>(config: T | {type: 'code'; code: string}) => config is T;
}

export const trigger = <Config extends JsonSchema>(trigger: Omit<Trigger<Config>, 'type'>): Trigger<Config> => ({type: 'trigger', ...trigger});
