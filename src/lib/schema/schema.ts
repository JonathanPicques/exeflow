interface JsonSchemaAll<T> {
    const?: T;
    default?: T;
    //
    title?: string;
    description?: string;
}

interface JsonSchemaAny extends JsonSchemaAll<any> {
    type?: never;
}

interface JsonSchemaObject extends JsonSchemaAll<object> {
    type: 'object';
    required?: string[];
    properties?: Record<string, JsonSchema>;
    additionalProperties?: boolean | JsonSchema;
}

interface JsonSchemaNumber extends JsonSchemaAll<number> {
    type: 'number';
}

interface JsonSchemaString extends JsonSchemaAll<string> {
    type: 'string';
    enum?: string[];
}

interface JsonSchemaBoolean extends JsonSchemaAll<boolean> {
    type: 'boolean';
}

export type JsonSchema = JsonSchemaAny | JsonSchemaObject | JsonSchemaNumber | JsonSchemaString | JsonSchemaBoolean;
export type InferJsonSchema<T extends JsonSchema> = T extends JsonSchemaAny
    ? InferJsonSchemaAny<T>
    : T extends JsonSchemaNumber
      ? InferJsonSchemaNumber<T>
      : T extends JsonSchemaString
        ? InferJsonSchemaString<T>
        : T extends JsonSchemaBoolean
          ? InferJsonSchemaBoolean<T>
          : T extends JsonSchemaObject
            ? InferJsonSchemaObject<T>
            : never;
export type InferJsonSchemaRecord<T extends Record<string, JsonSchema>> = {[K in keyof T]: InferJsonSchema<T[K]>};

type InferJsonSchemaAny<T extends JsonSchemaAny> = Const<T, any>;
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
