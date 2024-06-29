/**
 * Returns a valid HTML id constructed from the given ids
 * @example
 * ```ts
 * joinId('data', 'node', '123') -> 'data-node-123'
 * ```
 */
export const joinId = (...ids: string[]) => {
    return ids.join('-');
};
