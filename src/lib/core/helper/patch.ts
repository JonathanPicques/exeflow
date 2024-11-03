import {stableEqual} from './check';

type Diff = Same | Changed;
type Same = {
    same: {prev: unknown; next: unknown};
    changed?: never;
};
type Changed = ChangedValue | ChangedArray | ChangedObject;
type ChangedValue = {
    same?: never;
    changed: {
        value: {
            prev: unknown;
            next: unknown;
        };
        array?: never;
        object?: never;
    };
};
type ChangedArray = {
    same?: never;
    changed: {
        value?: never;
        array: {
            moved: Record<number | string | symbol, {from: number; to: number}>;
            added: Record<number | string | symbol, unknown>;
            removed: Record<number | string | symbol, unknown>;
            modified: Record<number | string | symbol, Diff>;
        };
        object?: never;
    };
};
type ChangedObject = {
    same?: never;
    changed: {
        value?: never;
        array?: never;
        object: Record<
            number | string | symbol,
            | {
                  added: unknown;
                  removed?: never;
                  changed?: never;
              }
            | {
                  added?: never;
                  removed: unknown;
                  changed?: never;
              }
            | {
                  added?: never;
                  removed?: never;
                  changed: Changed['changed'];
              }
        >;
    };
};

export const diff = (
    prev: unknown,
    next: unknown,
    {
        path = '',
        equal = stableEqual,
        mapper = (_, i) => i,
    }: {
        path?: string;
        equal?: (a: unknown, b: unknown) => boolean;
        mapper?: (_: any, i: number, arr: any[], path?: string) => number | string | symbol;
    } = {},
): Diff => {
    if (equal(prev, next)) return {same: {prev, next}};

    switch (typeof prev) {
        case 'bigint':
        case 'number':
        case 'string':
        case 'symbol':
        case 'boolean':
        case 'function':
        case 'undefined': {
            return {changed: {value: {prev, next}}};
        }
        case 'object': {
            if (prev === null) return {changed: {value: {prev, next}}};
            if (prev === undefined) return {changed: {value: {prev, next}}};
            if (next === null) return {changed: {value: {prev, next}}};
            if (next === undefined) return {changed: {value: {prev, next}}};

            if (typeof next === 'object') {
                if (Array.isArray(prev) && Array.isArray(next)) {
                    const prevs = new Map(prev.map((prev, index, arr) => [mapper(prev, index, arr, path), {index, value: prev}]));
                    const nexts = new Map(next.map((next, index, arr) => [mapper(next, index, arr, path), {index, value: next}]));
                    const changes: ChangedArray['changed']['array'] = {
                        moved: {},
                        added: {},
                        removed: {},
                        modified: {},
                    };

                    for (const [prevId, {value: prevValue}] of prevs) {
                        if (!nexts.has(prevId)) {
                            changes.removed[prevId] = prevValue;
                        }
                    }
                    for (const [nextId, {index: nextIndex, value: nextValue}] of nexts) {
                        if (!prevs.has(nextId)) {
                            changes.added[nextId] = nextValue;
                        } else {
                            const {index: prevIndex, value: prevValue} = prevs.get(nextId)!;

                            if (prevIndex !== nextIndex) {
                                changes.moved[nextId] = {from: prevIndex, to: nextIndex};
                            }
                            if (!equal(prevValue, nextValue)) {
                                changes.modified[nextId] = diff(prevValue, nextValue, {path, equal, mapper});
                            }
                        }
                    }
                    return {changed: {array: changes}};
                } else if (!Array.isArray(prev) && !Array.isArray(next)) {
                    const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
                    const changes: ChangedObject['changed']['object'] = {};

                    for (const key of keys) {
                        const hasPrev = key in prev;
                        const hasNext = key in next;
                        const prevValue = (prev as Record<string, unknown>)[key];
                        const nextValue = (next as Record<string, unknown>)[key];

                        if (!hasPrev) changes[key] = {added: nextValue};
                        else if (!hasNext) changes[key] = {removed: prevValue};
                        else if (!equal(prevValue, nextValue)) changes[key] = {changed: (diff(prevValue, nextValue, {path: join(path, key), equal, mapper}) as Changed).changed};
                    }
                    return {changed: {object: changes}};
                }
            }
            return {changed: {value: {prev, next}}};
        }
        default: {
            return {changed: {value: {prev, next}}};
        }
    }
};

const join = (...parts: string[]) => {
    return parts.filter(p => p !== undefined).join('.');
};
