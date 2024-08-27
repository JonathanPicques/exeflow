import {test, expect} from 'vitest';

import {fill, zero} from './data';

test('zero', () => {
    expect(zero({type: 'string'})).toBe('');
    expect(zero({type: 'string', const: 'hello!'})).toBe('hello!');
    expect(zero({type: 'string', default: 'welcome!'})).toBe('welcome!');
    expect(zero({type: 'string', const: 'hello!', default: 'welcome!'})).toBe('hello!');
    expect(zero({type: 'object'})).toStrictEqual({});
    expect(zero({type: 'object', properties: {name: {type: 'string', default: 'Joel'}}})).toStrictEqual({name: 'Joel'});
});

test('fill', () => {
    expect(fill({type: 'string'}, 'welcome')).toStrictEqual({type: 'string', default: 'welcome'});
    expect(fill({type: 'number'}, 'not a number' as any)).toStrictEqual({type: 'number'});
});
