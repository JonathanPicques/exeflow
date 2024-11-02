// imports must be relative for vite typechecking to work

export interface JsonSchemaAll<T> {
    const?: T;
    default?: T;
    //
    title?: string;
    description?: string;
    //
    editor?: {
        suggestions?: string[];
    };
}

export interface JsonSchemaAny extends JsonSchemaAll<any> {
    type?: never;
}

export interface JsonSchemaNull extends JsonSchemaAll<null> {
    type: 'null';
}

export interface JsonSchemaAnyOf extends JsonSchemaAll<any> {
    type?: never;
    anyOf: JsonSchema[];
}

export interface JsonSchemaArray extends JsonSchemaAll<any[]> {
    type: 'array';
    items?: JsonSchema;
}

export interface JsonSchemaObject extends JsonSchemaAll<object> {
    type: 'object';
    required?: string[];
    properties?: Record<string, JsonSchema>;
    additionalProperties?: boolean | JsonSchema;
}

export interface JsonSchemaNumber extends JsonSchemaAll<number> {
    type: 'number';
}

export interface JsonSchemaString extends JsonSchemaAll<string> {
    type: 'string';
    format?: string;
    placeholder?: string;
    //
    enum?: string[];
    enumLabels?: string[];
    //
    minLength?: number;
    maxLength?: number;
}

export interface JsonSchemaBoolean extends JsonSchemaAll<boolean> {
    type: 'boolean';
}

export type JsonSchema = JsonSchemaAnyOf | JsonSchemaAny | JsonSchemaNull | JsonSchemaArray | JsonSchemaObject | JsonSchemaNumber | JsonSchemaString | JsonSchemaBoolean;
