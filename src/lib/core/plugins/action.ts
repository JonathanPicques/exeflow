import type {JsonSchema, InferJsonSchema} from '$lib/schema/schema';

export type ActionId = string;

export interface Action<Config extends JsonSchema> {
    type: 'action';
    //
    icon: string;
    name?: string;
    color: string;
    description: string;
    //
    form: (args: FormArgs<Config>) => JsonSchema | Promise<JsonSchema>;
    data: (args: DataArgs<Config>) => ActionData<Config> | Promise<ActionData<Config>>;
}

export interface ActionData<Config extends JsonSchema> {
    valid: boolean;
    title?: string;
    config: {value: InferJsonSchema<Config>; schema: Config};
    inputs: string[];
    outputs: string[];
    results: Record<string, JsonSchema>;
}

interface FormArgs<Config extends JsonSchema> {
    config: InferJsonSchema<Config>;
    //
    constant: (config: unknown) => boolean;
}

interface DataArgs<Config extends JsonSchema> {
    form?: Partial<InferJsonSchema<Config>>;
    config?: InferJsonSchema<Config>;
    //
    constant: (config: unknown) => boolean;
}

export const action = <Config extends JsonSchema>(action: Omit<Action<Config>, 'type'>): Action<Config> => ({type: 'action', ...action});
