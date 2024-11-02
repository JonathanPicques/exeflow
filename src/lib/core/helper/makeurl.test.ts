import {test, expect} from 'vitest';
import {makeUrl} from './makeurl';

test('makeUrl', () => {
    expect(makeUrl('https://www.youtube.com', {})).toStrictEqual(new URL('https://www.youtube.com'));
    expect(makeUrl('https://www.youtube.com/watch', {v: 'odiWmW4EYTs', t: '10s'}).href).toEqual('https://www.youtube.com/watch?v=odiWmW4EYTs&t=10s');
    expect(makeUrl('https://www.sampleapi.com/batch', {ids: ['1', '3', '5']}).href).toEqual('https://www.sampleapi.com/batch?ids=1&ids=3&ids=5');
});
