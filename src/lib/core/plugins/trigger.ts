import type {JsonSchema, InferJsonSchema} from '$lib/schema/schema';

export type TriggerId = string;

export interface Trigger<Config extends JsonSchema> {
    type: 'trigger';
    //
    icon: string;
    color: string;
    description: string;
    //
    form: (args: FormArgs<Config>) => JsonSchema | Promise<JsonSchema>;
    data: (args: DataArgs<Config>) => TriggerData<Config> | Promise<TriggerData<Config>>;
}

export interface TriggerData<Config extends JsonSchema> {
    valid: boolean;
    title?: string;
    config: {value: unknown; schema: Config};
    outputs: string[];
    results: Record<string, JsonSchema>;
}

interface FormArgs<Config extends JsonSchema> {
    config: InferJsonSchema<Config>;
    //
    isConstant: (config: unknown) => boolean;
}

interface DataArgs<Config extends JsonSchema> {
    form?: Partial<InferJsonSchema<Config>>;
    config?: InferJsonSchema<Config>;
    //
    isConstant: (config: unknown) => boolean;
}

export const trigger = <Config extends JsonSchema>(trigger: Omit<Trigger<Config>, 'type'>): Trigger<Config> => ({type: 'trigger', ...trigger});
