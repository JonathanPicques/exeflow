import {test, expect} from 'vitest';

import {kvGet, kvSet, kvClear} from './kvstore';

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

test('tiny value', () => {
    const {get, set, clear, store} = createStore();

    kvSet('key', 'value', {set, maxSize: 1});
    expect(get('key.0')).toBe('v');
    expect(get('key.1')).toBe('a');
    expect(get('key.2')).toBe('l');
    expect(get('key.3')).toBe('u');
    expect(get('key.4')).toBe('e');
    expect(Object.keys(store)).toStrictEqual(['key.0', 'key.1', 'key.2', 'key.3', 'key.4']);
    expect(kvGet('key', {get})).toBe('value');

    kvClear('key', {get, clear});
    expect(get('key.0')).toBe(undefined);
    expect(get('key.1')).toBe(undefined);
    expect(get('key.2')).toBe(undefined);
    expect(get('key.3')).toBe(undefined);
    expect(get('key.4')).toBe(undefined);
    expect(Object.keys(store)).toStrictEqual([]);
    expect(kvGet('key', {get})).toBe(undefined);
});

test('small value', () => {
    const {get, set, clear, store} = createStore();

    kvSet('key', 'value', {set, maxSize: 2});
    expect(get('key.0')).toBe('va');
    expect(get('key.1')).toBe('lu');
    expect(get('key.2')).toBe('e');
    expect(Object.keys(store)).toStrictEqual(['key.0', 'key.1', 'key.2']);
    expect(kvGet('key', {get})).toBe('value');

    kvClear('key', {get, clear});
    expect(get('key.0')).toBe(undefined);
    expect(get('key.1')).toBe(undefined);
    expect(get('key.2')).toBe(undefined);
    expect(Object.keys(store)).toStrictEqual([]);
    expect(kvGet('key', {get})).toBe(undefined);
});

test('large value', () => {
    const {get, set, clear, store} = createStore();

    kvSet('key', 'value', {set, maxSize: 10});
    expect(get('key')).toBe('value');
    expect(Object.keys(store)).toStrictEqual(['key']);
    expect(kvGet('key', {get})).toBe('value');

    kvClear('key', {get, clear});
    expect(get('key')).toBe(undefined);
    expect(Object.keys(store)).toStrictEqual([]);
    expect(kvGet('key', {get})).toBe(undefined);
});

test('empty value', () => {
    const {get, set} = createStore();
    expect(kvGet('key', {get})).toBe(undefined);
    kvSet('key', '', {set, maxSize: 10});
    expect(kvGet('key', {get})).toBe('');
});

test('very large value', () => {
    const {get, set} = createStore();
    const value = 'value'.repeat(1000000);

    expect(kvGet('key', {get})).toBe(undefined);
    kvSet('key', value, {set});
    expect(kvGet('key', {get})).toBe(value);
});

test('multiple values', () => {
    const {get, set, clear} = createStore();

    kvSet('key1', 'value1', {set, maxSize: 10});
    kvSet('key2', 'value2', {set, maxSize: 10});

    expect(kvGet('key1', {get})).toBe('value1');
    expect(kvGet('key2', {get})).toBe('value2');
    expect(kvGet('key3', {get})).toBe(undefined);

    kvClear('key1', {get, clear});
    expect(kvGet('key1', {get})).toBe(undefined);
    expect(kvGet('key2', {get})).toBe('value2');

    kvClear('key2', {get, clear});
    expect(kvGet('key1', {get})).toBe(undefined);
    expect(kvGet('key2', {get})).toBe(undefined);
});
