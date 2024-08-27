import {test, expectTypeOf} from 'vitest';

import type {InferJsonSchema} from './infer';

test('InferJsonSchema', () => {
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

    expectTypeOf<InferJsonSchema<{type: 'object'}>>().toEqualTypeOf<Record<string, unknown>>();
    expectTypeOf<InferJsonSchema<{type: 'object'; const: {id: '123'}}>>().toMatchTypeOf<{id: '123'}>();
    expectTypeOf<InferJsonSchema<{type: 'object'; properties: {id: {type: 'string'}}}>>().toMatchTypeOf<{id?: string}>();
    expectTypeOf<InferJsonSchema<{type: 'object'; properties: {id: {type: 'string'}}; required: ['id']}>>().toMatchTypeOf<{id: string}>();

    expectTypeOf<InferJsonSchema<{anyOf: [{type: 'string'}, {type: 'number'}, {type: 'boolean'}, {type: 'array'; items: {type: 'string'}}]}>>().toEqualTypeOf<
        string | number | boolean | string[]
    >();
    // expectTypeOf<InferJsonSchema<{anyOf: [{type: 'object'; required: ['x']; properties: {x: {type: 'string'}}}]}>>().toEqualTypeOf<{x: string}>();
});
