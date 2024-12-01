import {test, expectTypeOf} from 'vitest';

import type {InferJsonSchema} from './infer';

test('InferJsonSchema', () => {
    expectTypeOf<InferJsonSchema<{type: 'null'}>>().toEqualTypeOf<null>();

    expectTypeOf<InferJsonSchema<{type: 'number'}>>().toEqualTypeOf<number>();
    expectTypeOf<InferJsonSchema<{type: 'number'; const: 32}>>().toEqualTypeOf<32>();

    expectTypeOf<InferJsonSchema<{type: 'string'}>>().toEqualTypeOf<string>();
    expectTypeOf<InferJsonSchema<{type: 'string'; enum: ['hello', 'whatever']}>>().toEqualTypeOf<'hello' | 'whatever'>();
    expectTypeOf<InferJsonSchema<{type: 'string'; const: 'my value'}>>().toEqualTypeOf<'my value'>();

    expectTypeOf<InferJsonSchema<{type: 'boolean'}>>().toEqualTypeOf<boolean>();
    expectTypeOf<InferJsonSchema<{type: 'boolean'; const: true}>>().toEqualTypeOf<true>();
    expectTypeOf<InferJsonSchema<{type: 'boolean'; const: false}>>().toEqualTypeOf<false>();

    expectTypeOf<InferJsonSchema<{type: 'array'; items: {}}>>().toEqualTypeOf<any[]>();
    expectTypeOf<InferJsonSchema<{type: 'array'; items: {type: 'string'}}>>().toEqualTypeOf<string[]>();
    expectTypeOf<InferJsonSchema<{type: 'array'; const: [12, '13', false]}>>().toEqualTypeOf<[12, '13', false]>();

    expectTypeOf<InferJsonSchema<{type: 'object'}>>().toEqualTypeOf<{[x: string]: unknown}>();
    expectTypeOf<InferJsonSchema<{type: 'object'}>>().toEqualTypeOf<Record<string, unknown>>();
    expectTypeOf<InferJsonSchema<{type: 'object'; const: {id: '123'}}>>().toEqualTypeOf<{id: '123'}>();
    expectTypeOf<InferJsonSchema<{type: 'object'; properties: {id: {type: 'string'}}}>>().toEqualTypeOf<{id?: string; [x: string]: unknown}>();
    expectTypeOf<InferJsonSchema<{type: 'object'; properties: {id: {type: 'string'}}; required: ['id']}>>().toEqualTypeOf<{id: string; [x: string]: unknown}>();
    expectTypeOf<InferJsonSchema<{type: 'object'; properties: {id: {type: 'string'}; name: {type: 'string'}}; required: ['id']}>>().toEqualTypeOf<{
        id: string;
        name?: string;
        [x: string]: unknown;
    }>();

    expectTypeOf<InferJsonSchema<{type: 'object'; additionalProperties: true}>>().toEqualTypeOf<{[x: string]: unknown}>();
    expectTypeOf<InferJsonSchema<{type: 'object'; additionalProperties: false}>>().toEqualTypeOf<{}>();
    expectTypeOf<InferJsonSchema<{type: 'object'; properties: {id: {type: 'string'}}; additionalProperties: true}>>().toEqualTypeOf<{id?: string; [x: string]: unknown}>();
    expectTypeOf<InferJsonSchema<{type: 'object'; properties: {id: {type: 'string'}}; additionalProperties: false}>>().toEqualTypeOf<{id?: string}>();
    expectTypeOf<InferJsonSchema<{type: 'object'; properties: {id: {type: 'string'}}; required: ['id']; additionalProperties: true}>>().toEqualTypeOf<{
        id: string;
        [x: string]: unknown;
    }>();
    expectTypeOf<InferJsonSchema<{type: 'object'; properties: {id: {type: 'string'}}; required: ['id']; additionalProperties: {type: 'string'}}>>().toEqualTypeOf<{
        id: string;
        [x: string]: string;
    }>();

    type Scalar = {type: 'number'};
    type Vector2 = {type: 'object'; required: ['x', 'y']; properties: {x: {type: 'number'}; y: {type: 'number'}}; additionalProperties: false};

    expectTypeOf<InferJsonSchema<{anyOf: [Scalar, Vector2]}>>().toEqualTypeOf<number | {x: number; y: number}>();
    expectTypeOf<InferJsonSchema<{anyOf: [{type: 'string'}, {type: 'number'}, {type: 'boolean'}, {type: 'array'; items: {type: 'string'}}]}>>().toEqualTypeOf<
        string | number | boolean | string[]
    >();
});
