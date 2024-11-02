const cyrb53 = (str: string, seed = 0) => {
    // cyrb53 (c) 2018 bryc (github.com/bryc)
    // https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js

    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

/**
 * @returns whether the checksums of a and b are equal
 * @example
 * ```ts
 * stableEqual({name: 'John'}, {name: 'Jane'}) => false
 * stableEqual({name: 'John', age: 64}, {age: 64, name: 'John'}) => true
 * ```
 */
export const stableEqual = (a: unknown, b: unknown) => {
    return stableChecksum(a) === stableChecksum(b);
};

/**
 * @returns a stable checksum for the given value (will fail for a value containing cyclic references)
 * @example
 * ```ts
 * stableChecksum({lastName: 'Kent', firstName: 'Clark'}) === stableChecksum({firstName: 'Clark', lastName: 'Kent'})
 * ```
 */
export const stableChecksum = (value: any) => {
    return cyrb53(stableStringify(value));
};

/**
 * @returns a stable string for the given value (will fail for a value containing cyclic references)
 * @example
 * ```ts
 * stableStringify({lastName: 'Kent', firstName: 'Clark'}) === stableStringify({firstName: 'Clark', lastName: 'Kent'})
 * ```
 */
export const stableStringify = (value: any): string => {
    let stringified = '';

    switch (typeof value) {
        case 'number':
        case 'string':
        case 'bigint':
        case 'boolean':
            stringified += JSON.stringify(value);
            break;
        //
        case 'object': {
            if (Array.isArray(value)) {
                stringified += '[';
                for (const item of value) {
                    stringified += `${stableStringify(item)},`;
                }
                stringified += ']';
                break;
            } else if (value !== null) {
                const keys = Object.keys(value).sort();
                stringified += '{';
                for (const key of keys) {
                    const subvalue = value[key];

                    if (!subvalue) continue;
                    stringified += `${JSON.stringify(key)}: ${stableStringify(value[key])},`;
                }
                stringified += '}';
                break;
            } else {
                stringified += `${value}`;
            }
            break;
        }
        case 'function': {
            stringified += value.toString();
            break;
        }
        //
        default: {
            throw new Error(`${value} is not stable`);
        }
    }
    return stringified;
};
