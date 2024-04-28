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

type InferJsonSchemaAny<T extends JsonSchemaAny> = ConstOrDefault<T, any>;
type InferJsonSchemaObject<T extends JsonSchemaObject> = ConstOrDefault<T, MapObject<T>>;
type InferJsonSchemaNumber<T extends JsonSchemaNumber> = ConstOrDefault<T, number>;
type InferJsonSchemaString<T extends JsonSchemaString> = ConstOrDefault<T, T['enum'] extends (infer E)[] ? E : string>;
type InferJsonSchemaBoolean<T extends JsonSchemaBoolean> = ConstOrDefault<T, boolean>;

type ConstOrDefault<T extends JsonSchema, Fallback> = T['const'] extends infer C extends {} ? C : T['default'] extends infer D extends {} ? D : Fallback;

type MapObject<T extends JsonSchemaObject> =
    T['properties'] extends Record<string, JsonSchema>
        ? {[K in RequiredKeys<T>]: InferJsonSchema<T['properties'][K]>} & {[K in NonRequiredKeys<T>]+?: InferJsonSchema<T['properties'][K]>}
        : object;
type PropertyKeys<T extends JsonSchemaObject> = keyof T['properties'];
type RequiredKeys<T extends JsonSchemaObject> = T['required'] extends (infer K)[] ? K & PropertyKeys<T> : never;
type NonRequiredKeys<T extends JsonSchemaObject> = Exclude<PropertyKeys<T>, RequiredKeys<T>>;
