import type {JSONSchema, FromObjectSchema} from '$lib/schema/schema';

export interface Trigger<Config, Signature extends TriggerSignature = TriggerSignature> {
    type: 'trigger';
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

interface RenderNodeArgs<Config, Signature extends TriggerSignature> {
    config: Config;
    params?: FromObjectSchema<Signature['returns']['values']>;
}

export interface TriggerSignature {
    outputs: string[];
    //
    returns: {order: string[]; values: Record<string, JSONSchema>};
}

export const trigger = <Config, Signature extends TriggerSignature = TriggerSignature>(trigger: Omit<Trigger<Config, Signature>, 'type'>) => ({type: 'trigger', ...trigger});
export const emptyTriggerSignature: TriggerSignature = {
    outputs: [],
    //
    returns: {order: [], values: {}},
};
