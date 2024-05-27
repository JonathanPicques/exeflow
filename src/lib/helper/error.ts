import {json, error} from '@sveltejs/kit';

/**
 * Helper class to handle errors in both svelte load and GET/POST/... routes
 */
export class AppError extends Error {
    constructor(
        message: string,
        readonly statusCode: number = 400,
    ) {
        super(message);
    }

    error() {
        throw error(this.statusCode, this.message);
    }

    response() {
        return json({message: this.message}, {status: this.statusCode});
    }
}

/**
 * Returns what the specified function would return, or a default value if an exception was thrown.
 * @param fn - a function returning a value
 * @param defaultValue - returned when an exception is thrown, `undefined` if not specified.
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
