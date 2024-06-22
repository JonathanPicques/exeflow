interface JsonSchemaAll<T> {
    const?: T;
    default?: T;
    //
    title?: string;
    description?: string;
}

export interface JsonSchemaAny extends JsonSchemaAll<any> {
    type?: never;
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
    enum?: string[];
    format?: 'text';
    enumLabels?: string[];
    placeholder?: string;
}

export interface JsonSchemaBoolean extends JsonSchemaAll<boolean> {
    type: 'boolean';
}

export type JsonSchema = JsonSchemaAnyOf | JsonSchemaAny | JsonSchemaArray | JsonSchemaObject | JsonSchemaNumber | JsonSchemaString | JsonSchemaBoolean;
export type InferJsonSchema<T extends JsonSchema> = T extends JsonSchemaAny
    ? InferJsonSchemaAny<T>
    : T extends JsonSchemaAnyOf
      ? InferJsonSchemaAnyOf<T>
      : T extends JsonSchemaNumber
        ? InferJsonSchemaNumber<T>
        : T extends JsonSchemaString
          ? InferJsonSchemaString<T>
          : T extends JsonSchemaBoolean
            ? InferJsonSchemaBoolean<T>
            : T extends JsonSchemaArray
              ? InferJsonSchemaArray<T>
              : T extends JsonSchemaObject
                ? InferJsonSchemaObject<T>
                : never;

export type InferJsonSchemaRecord<T extends Record<string, JsonSchema>> = {[K in keyof T]: InferJsonSchema<T[K]>};

type InferJsonSchemaAny<T extends JsonSchemaAny> = Const<T, any>;
type InferJsonSchemaAnyOf<T extends JsonSchemaAnyOf> = Const<T, InferJsonSchema<T['anyOf'][number]>>;

type InferJsonSchemaArray<T extends JsonSchemaArray> = Const<T, InferJsonSchema<T['items'] extends {} ? T['items'] : {}>[]>;
type InferJsonSchemaObject<T extends JsonSchemaObject> = Const<T, MapObject<T>>;
type InferJsonSchemaNumber<T extends JsonSchemaNumber> = Const<T, number>;
type InferJsonSchemaString<T extends JsonSchemaString> = Const<T, T['enum'] extends (infer E)[] ? E : string>;
type InferJsonSchemaBoolean<T extends JsonSchemaBoolean> = Const<T, boolean>;

type Const<T extends JsonSchema, Fallback> = T['const'] extends infer C extends {} ? C : Fallback;
type MapObject<T extends JsonSchemaObject> =
    T['properties'] extends Record<string, JsonSchema>
        ? {[K in RequiredKeys<T>]: InferJsonSchema<T['properties'][K]>} & {[K in NonRequiredKeys<T>]+?: InferJsonSchema<T['properties'][K]>}
        : Record<string, unknown>;
type PropertyKeys<T extends JsonSchemaObject> = keyof T['properties'];
type RequiredKeys<T extends JsonSchemaObject> = T['required'] extends (infer K)[] ? K & PropertyKeys<T> : never;
type NonRequiredKeys<T extends JsonSchemaObject> = Exclude<PropertyKeys<T>, RequiredKeys<T>>;
