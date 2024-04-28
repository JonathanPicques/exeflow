import type {JsonSchema, InferJsonSchemaRecord} from '$lib/schema/schema';

export interface Action<Config, Signature extends ActionSignature = ActionSignature> {
    type: 'action';
    //
    icon: string;
    title: string;
    description: string;
    //
    config: (args: ConfigArgs<Config>) => ConfigResult<Config> | Promise<ConfigResult<Config>>;
    renderForm: (args: RenderFormArgs<Config>) => JsonSchema | Promise<JsonSchema>;
    renderNode: (args: RenderNodeArgs<Config, Signature>) => Signature | Promise<Signature>;
}

export type ActionId = string;

interface ConfigArgs<Config> {
    form?: unknown;
    config?: Config;
}

interface ConfigResult<Config> {
    valid: boolean;
    props?: unknown;
    config: Config;
}

interface RenderFormArgs<Config> {
    config: Config;
    props?: unknown;
}

interface RenderNodeArgs<Config, Signature extends ActionSignature> {
    config: Config;
    params?: InferJsonSchemaRecord<Signature['params']['values']>;
}

export interface ActionSignature {
    inputs: string[];
    outputs: string[];
    //
    params: {order: string[]; values: Record<string, JsonSchema>};
    returns: {order: string[]; values: Record<string, JsonSchema>};
}

export const action = <Config, Signature extends ActionSignature = ActionSignature>(action: Omit<Action<Config, Signature>, 'type'>) => ({type: 'action', ...action});
export const emptyActionSignature: ActionSignature = {
    inputs: [],
    outputs: [],
    //
    params: {order: [], values: {}},
    returns: {order: [], values: {}},
};
