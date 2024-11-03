/**
 * @returns a promise that will resolve in the given amount of milliseconds
 * @example
 * ```ts
 * await wait(500);
 * await Promise.all([api.call(), wait(1000)]);
 * ```
 */
export const wait = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * @returns what the specified function would return, or a default value if an exception was thrown
 * @param fn - a function returning a value
 * @param defaultValue - returned when an exception is thrown, `undefined` if not specified
 * @example
 * ```ts
 * trySync(() => 'welcome') => 'welcome'
 * trySync(() => { throw new Error(); }) => undefined
 * trySync(() => { throw new Error(); }, 'error occured') => 'error occured'
 * ```
 */
export const trySync = <T, U = undefined>(fn: () => T, defaultValue: U = undefined as U) => {
    try {
        return fn();
    } catch (_) {
        return defaultValue;
    }
};

/**
 * @returns what the specified function would return, or a default value if an exception was thrown
 * @param fn - a function returning a value
 * @param defaultValue - returned when an exception is thrown, `undefined` if not specified
 * @example
 * ```ts
 * (await tryAsync(async () => await request.text())) => 'welcome'
 * (await tryAsync(async () => await request.error())) => undefined
 * (await tryAsync(async () => { throw new Error(); })) => undefined
 * (await tryAsync(async () => { throw new Error(); }, 'error occured')) => 'error occured'
 * ```
 */
export const tryAsync = async <T, U = undefined>(fn: () => T, defaultValue: U = undefined as U) => {
    try {
        return await fn();
    } catch (_) {
        return defaultValue;
    }
};
