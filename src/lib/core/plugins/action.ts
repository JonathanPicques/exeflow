import type {JsonSchema} from '$lib/core/schema/schema';
import type {InferRootConfig} from '$lib/core/plugins/config/infer';

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
    config: {value: InferRootConfig<Config>; schema: Config};
    inputs: string[];
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

export const action = <Config extends JsonSchema>(action: Omit<Action<Config>, 'type'>): Action<Config> => ({type: 'action', ...action});
