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
 * tryFunction(() => 'welcome') => 'welcome'
 * tryFunction(() => { throw new Error(); }) => undefined
 * tryFunction(() => { throw new Error(); }, 'error occured') => 'error occured'
 * ```
 */
export const tryFunction = <T, U = undefined>(fn: () => T, defaultValue: U = undefined as U) => {
    try {
        return fn();
    } catch (_) {
        return defaultValue;
    }
};
