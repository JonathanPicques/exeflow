type Get = (key: string) => string | undefined;
type Set = (key: string, value: string) => void;
type Clear = (key: string) => void;

/**
 * Retrieves a value from a store, handling chunked data.
 *
 * @param key - The key to retrieve the value for.
 * @param store - An object with a `get` function that retrieves values from the underlying store.
 * @returns The value associated with the key, or `undefined` if the key is not found.
 */
export const chunkedGet = (key: string, store: {get: Get}) => {
    const values: string[] = [];

    for (let i = 0; ; i++) {
        const chunk = store.get(`${key}.${i}`);
        if (chunk === undefined) break;

        values.push(chunk);
    }
    return values.length ? values.join('') : store.get(key);
};

/**
 * Sets a value in a store, handling chunked data.
 *
 * @param key - The key to set the value for.
 * @param value - The value to store.
 * @param store - An object with a `set` function that sets values in the underlying store, and an optional `size` property that determines the chunk size (defaults to 3600).
 */
export const chunkedSet = (key: string, value: string, store: {set: Set; size?: number}) => {
    const count = Math.ceil(value.length / (store.size ?? 3600));
    if (count === 1) {
        store.set(key, value);
        return;
    }

    const values = value.match(new RegExp(`.{1,${store.size}}`, 'g'));
    values?.forEach((value, i) => {
        store.set(`${key}.${i}`, value);
    });
};

/**
 * Clears a value from a store, handling chunked data.
 *
 * @param {string} key - The key to clear the value for.
 * @param {object} store - An object with `get` and `clear` functions that retrieve and clear values in the underlying store.
 */
export const chunkedClear = (key: string, store: {get: Get; clear: Clear}) => {
    const firstChunk = store.get(key);
    if (firstChunk) {
        store.clear(key);
        return;
    }

    for (let i = 0; ; i++) {
        const chunkKey = `${key}.${i}`;
        const chunk = store.get(chunkKey);
        if (!chunk) break;

        store.clear(chunkKey);
    }
};
