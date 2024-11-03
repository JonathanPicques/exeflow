import {test, expect} from 'vitest';

import {trySync, tryAsync} from './function';

test('trySync', () => {
    expect(
        trySync(() => {
            return 'welcome';
        }),
    ).toBe('welcome');
    expect(
        trySync(() => {
            throw new Error();
        }),
    ).toBe(undefined);
    expect(
        trySync(() => {
            throw new Error();
        }, 'error occured'),
    ).toBe('error occured');
});

test('tryAsync', async () => {
    const request = {
        async text() {
            return 'welcome';
        },
        async error() {
            throw new Error();
        },
    };

    expect(
        await tryAsync(async () => {
            return await request.text();
        }),
    ).toBe('welcome');
    expect(
        await tryAsync(async () => {
            return await request.error();
        }),
    ).toBe(undefined);
    expect(
        await tryAsync(async () => {
            throw new Error();
        }),
    ).toBe(undefined);
    expect(
        await tryAsync(async () => {
            throw new Error();
        }, 'error occured'),
    ).toBe('error occured');
});
