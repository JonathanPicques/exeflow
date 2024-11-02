/**
 * Obtain the parameters of a constructor function type in a tuple
 *
 * `ConstructorParameters<T>` exists in lib.es5.d.ts, but it does not work as it adds `abstract` in the infer rule
 */
export type ConstructorParameters<T> = T extends new (...args: infer U) => any ? U : never;
