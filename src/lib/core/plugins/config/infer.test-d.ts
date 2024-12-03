import {test, expectTypeOf} from 'vitest';

import type {InferConfig} from './infer';

test('InferConfig', () => {
    expectTypeOf<InferConfig<{type: 'null'}>>().toEqualTypeOf<null | string | {type: 'code'; code: string}>();
    expectTypeOf<InferConfig<{type: 'number'}>>().toEqualTypeOf<number | string | {type: 'code'; code: string}>();
    expectTypeOf<InferConfig<{type: 'string'}>>().toEqualTypeOf<string | {type: 'code'; code: string}>();
    expectTypeOf<InferConfig<{type: 'object'; required: ['name']; properties: {name: {type: 'string'}}; additionalProperties: false}>>().toEqualTypeOf<
        string | {name: string | {type: 'code'; code: string}} | {type: 'code'; code: string}
    >();
});
