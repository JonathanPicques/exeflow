import type {JSONSchema, FromObjectSchema} from '$lib/schema/schema';

export interface Action<Config, Signature extends ActionSignature = ActionSignature> {
    type: 'action';
    icon: string;
    title: string;
    description: string;
    //
    config: (args: ConfigArgs<Config>) => ConfigResult<Config> | Promise<ConfigResult<Config>>;
    renderForm: (args: RenderFormArgs<Config>) => JSONSchema | Promise<JSONSchema>;
    renderNode: (args: RenderNodeArgs<Config, Signature>) => Signature | Promise<Signature>;
}

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
    params?: FromObjectSchema<Signature['params']['values']>;
}

export interface ActionSignature {
    inputs: string[];
    outputs: string[];
    //
    params: {order: string[]; values: Record<string, JSONSchema>};
    returns: {order: string[]; values: Record<string, JSONSchema>};
}

export const action = <Config, Signature extends ActionSignature = ActionSignature>(action: Omit<Action<Config, Signature>, 'type'>) => ({type: 'action', ...action});
export const emptyActionSignature: ActionSignature = {
    inputs: [],
    outputs: [],
    //
    params: {order: [], values: {}},
    returns: {order: [], values: {}},
};
