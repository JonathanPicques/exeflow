type Set = (key: string, value: string) => void;
type Get = (key: string) => string | undefined;
type Clear = (key: string) => void;

/**
 * Sets a value in a key/value store, chunking the data in sub-keys if needed to circumvent value size restrictions (`${key}.0`, `${key}.1`, ..., `${key}.${i}`).
 *
 * @param key - The key to set the value for.
 * @param value - The value to store.
 * @param store - An object with a `set` function that sets values by keys in the underlying store, and an optional `maxSize` property that determines the max chunk size (defaults to 3600).
 */
export const kvSet = (key: string, value: string, store: {set: Set; maxSize?: number}) => {
    const maxSize = store.maxSize ?? 3600;

    const count = Math.ceil(value.length / maxSize);
    if (count <= 1) {
        store.set(key, value);
        return;
    }

    const chunks: string[] = new Array(Math.ceil(value.length / maxSize));
    for (let i = 0; i < chunks.length; i++) {
        const start = i * maxSize;
        chunks[i] = value.slice(start, start + maxSize);
        store.set(`${key}.${i}`, chunks[i]);
    }
};

/**
 * Retrieves a value from a key/value store, handling chunked data.
 *
 * @param key - The key to retrieve the value for.
 * @param store - An object with a `get` function that retrieves values by keys from the underlying store.
 * @returns The value associated with the key, or `undefined` if the key is not found.
 */
export const kvGet = (key: string, store: {get: Get}) => {
    const values: string[] = [];

    for (let i = 0; ; i++) {
        const chunk = store.get(`${key}.${i}`);
        if (chunk === undefined) break;

        values.push(chunk);
    }
    return values.length ? values.join('') : store.get(key);
};

/**
 * Clears a value from a key/value store, handling chunked data.
 *
 * @param {string} key - The key to clear the value for.
 * @param {object} store - An object with `get` and `clear` functions that retrieve and clear values by keys from the underlying store.
 */
export const kvClear = (key: string, store: {get: Get; clear: Clear}) => {
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
