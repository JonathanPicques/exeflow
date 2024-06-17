/**
 * Returns whether the given value is constant (no interpolation)
 * @examples
 * ```ts
 * isConstant('sk-123') => true
 * isConstant('sk-123-${env:SK_SUFFIX}') => false
 * isConstant('Hello ${node:1234:user.name}!') => false
 * ```
 */
export const isConstant = (what: unknown) => {
    // TODO: improve this naive implementation
    if (typeof what === 'string') {
        return !what.includes('$');
    }
    return true;
};
