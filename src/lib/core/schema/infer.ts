// imports must be relative for vite typechecking to work

import type {JsonSchema, JsonSchemaAny, JsonSchemaNull, JsonSchemaAnyOf, JsonSchemaArray, JsonSchemaNumber, JsonSchemaObject, JsonSchemaString, JsonSchemaBoolean} from './schema';

type Const<T extends JsonSchema, Fallback> = T extends {const: infer C} ? C : Fallback;
type MapEnum<T extends JsonSchemaString> = T['enum'] extends (infer E)[] ? E : string;
type MapObject<T extends JsonSchemaObject> =
    T['properties'] extends Record<string, JsonSchema>
        ? {[K in RequiredKeys<T>]: InferJsonSchema<T['properties'][K]>} & {[K in NonRequiredKeys<T>]+?: InferJsonSchema<T['properties'][K]>} & AdditionalProperties<T>
        : AdditionalProperties<T>;
type PropertyKeys<T extends JsonSchemaObject> = keyof T['properties'];
type RequiredKeys<T extends JsonSchemaObject> = T['required'] extends (infer K)[] ? K & PropertyKeys<T> : never;
type NonRequiredKeys<T extends JsonSchemaObject> = Exclude<PropertyKeys<T>, RequiredKeys<T>>;
type AdditionalProperties<T extends JsonSchemaObject> = T['additionalProperties'] extends false
    ? {}
    : T['additionalProperties'] extends JsonSchema
      ? Record<string, InferJsonSchema<T['additionalProperties']>>
      : Record<string, unknown>;

type InferJsonSchemaAny<T extends JsonSchemaAny> = Const<T, any>;
type InferJsonSchemaNull<T extends JsonSchemaNull> = Const<T, null>;
type InferJsonSchemaAnyOf<T extends JsonSchemaAnyOf> = Const<T, InferJsonSchema<T['anyOf'][number]>>;
type InferJsonSchemaArray<T extends JsonSchemaArray> = Const<T, InferJsonSchema<T['items'] extends {} ? T['items'] : {}>[]>;
type InferJsonSchemaObject<T extends JsonSchemaObject> = Const<T, MapObject<T> extends infer Values ? {[K in keyof Values]: Values[K]} : never>;
type InferJsonSchemaNumber<T extends JsonSchemaNumber> = Const<T, number>;
type InferJsonSchemaString<T extends JsonSchemaString> = Const<T, MapEnum<T>>;
type InferJsonSchemaBoolean<T extends JsonSchemaBoolean> = Const<T, boolean>;

export type InferJsonSchema<T extends JsonSchema> = T extends JsonSchemaAny
    ? InferJsonSchemaAny<T>
    : T extends JsonSchemaNull
      ? InferJsonSchemaNull<T>
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
