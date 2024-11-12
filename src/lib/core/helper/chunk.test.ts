import {test, expect} from 'vitest';

import {chunkedGet, chunkedSet, chunkedClear} from './chunk';

const createStore = () => {
    const store: Record<string, string> = {};

    return {
        get: (key: string) => {
            return store[key];
        },
        set: (key: string, value: string) => {
            store[key] = value;
        },
        clear: (key: string) => {
            delete store[key];
        },
        store,
    };
};

test('small chunks', () => {
    const {get, set, clear, store} = createStore();

    chunkedSet('key', 'value', {set, size: 10});
    expect(get('key')).toBe('value');
    expect(Object.keys(store)).toStrictEqual(['key']);
    expect(chunkedGet('key', {get})).toBe('value');

    chunkedClear('key', {get, clear});
    expect(get('key')).toBe(undefined);
    expect(Object.keys(store)).toStrictEqual([]);
    expect(chunkedGet('key', {get})).toBe(undefined);
});

test('large chunks', () => {
    const {get, set, clear, store} = createStore();

    chunkedSet('key', 'value', {set, size: 1});
    expect(get('key.0')).toBe('v');
    expect(get('key.1')).toBe('a');
    expect(get('key.2')).toBe('l');
    expect(get('key.3')).toBe('u');
    expect(get('key.4')).toBe('e');
    expect(Object.keys(store)).toStrictEqual(['key.0', 'key.1', 'key.2', 'key.3', 'key.4']);
    expect(chunkedGet('key', {get})).toBe('value');

    chunkedClear('key', {get, clear});
    expect(get('key.0')).toBe(undefined);
    expect(get('key.1')).toBe(undefined);
    expect(get('key.2')).toBe(undefined);
    expect(get('key.3')).toBe(undefined);
    expect(get('key.4')).toBe(undefined);
    expect(Object.keys(store)).toStrictEqual([]);
    expect(chunkedGet('key', {get})).toBe(undefined);
});
