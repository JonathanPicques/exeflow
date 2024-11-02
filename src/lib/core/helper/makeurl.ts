/**
 * @returns a new URL with the given url and search params
 * @example
 * ```ts
 * makeUrl('https://www.youtube.com/watch', {v: 'odiWmW4EYTs', t: '10s'}).href => 'https://www.youtube.com/watch?v=odiWmW4EYTs&t=17s'
 * ```
 */
export const makeUrl = (url: string, searchParams: Record<string, string | string[]>) => {
    const _url = new URL(url);
    for (const [key, value] of Object.entries(searchParams)) {
        if (Array.isArray(value)) {
            for (const v of value) {
                _url.searchParams.append(key, v);
            }
        } else {
            _url.searchParams.set(key, value);
        }
    }
    return _url;
};
