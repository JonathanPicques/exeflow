import {test, expect} from 'vitest';

import {parse, access, resolve, constant, evaluate, nodeInterpolation, secretInterpolation} from './parser';

test('parse', () => {
    expect(parse('Hello world')).toStrictEqual([{type: 'text', text: 'Hello world'}]);
    expect(parse('Hello ${secret:USER}!')).toStrictEqual([
        {type: 'text', text: 'Hello '},
        {type: 'secret', key: 'USER'},
        {type: 'text', text: '!'},
    ]);
    expect(parse('${secret:USER} welcome!')).toStrictEqual([
        {type: 'secret', key: 'USER'},
        {type: 'text', text: ' welcome!'},
    ]);
    expect(parse('Hello ${secret:USER}, how are you? I love ${secret:LOVER}')).toStrictEqual([
        {type: 'text', text: 'Hello '},
        {type: 'secret', key: 'USER'},
        {type: 'text', text: ', how are you? I love '},
        {type: 'secret', key: 'LOVER'},
    ]);
});

test('access', () => {
    expect(access({hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}}, '')).toStrictEqual({hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}});
    expect(access({hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}}, 'hero')).toStrictEqual({name: 'Zorro', friends: ['Bernardo', 'Garcia']});
    expect(access({hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}}, 'hero.name')).toStrictEqual('Zorro');
    expect(access({hero: {name: 'Zorro', friends: ['Bernardo', 'Garcia']}}, 'hero.friends.1')).toStrictEqual('Garcia');
});

test('resolve', () => {
    expect(resolve('Hello ${secret:USER}', {type: 'string'}, {secrets: {USER: 'jonathan'}})).toBe('Hello jonathan');
    expect(resolve('Hello ${node:createUser:user}', {type: 'string'}, {nodes: {createUser: {user: 'jonathan'}}})).toBe('Hello jonathan');
    expect(resolve({greeting: 'Hello ${secret:USER}'}, {type: 'object', properties: {greeting: {type: 'string'}}}, {secrets: {USER: 'jonathan'}})).toStrictEqual({
        greeting: 'Hello jonathan',
    });
});

test('constant', () => {
    expect(constant('Welcome!')).toBe(true);
    expect(constant('Hello ${node:createUser:user:name}!')).toBe(false);
    expect(constant('You API key: ${secret:MISTRAL_API_KEY}!')).toBe(false);
    expect(constant('You API key: ${secret:MISTRAL_API_KEY### !')).toBe(true);
});

test('evaluate', () => {
    expect(evaluate('Hello ${secret:USER}', {secrets: {USER: 'jonathan'}})).toBe('Hello jonathan');
    expect(evaluate('Hello ${node:createUser:user:name}', {nodes: {createUser: {user: {name: 'jonathan'}}}})).toBe('Hello jonathan');
});

test('nodeInterpolation', () => {
    expect(nodeInterpolation('createUser', 'user', 'name')).toBe('${node:createUser:user:name}');
    expect(nodeInterpolation('retrieveUser', 'user', 'address.country')).toBe('${node:retrieveUser:user:address.country}');
});

test('secretInterpolation', () => {
    expect(secretInterpolation('MISTRAL_API_KEY')).toBe('${secret:MISTRAL_API_KEY}');
});
