import {stableEqual} from './check';

export const diff = (
    prev: unknown,
    next: unknown,
    {equal = stableEqual, mapper = (_, i) => i}: {equal?: (a: unknown, b: unknown) => boolean; mapper?: (_: any, i: number, arr: any[]) => string | number | symbol} = {},
) => {
    if (equal(prev, next)) return {same: {prev, next}};

    switch (typeof prev) {
        case 'bigint':
        case 'number':
        case 'string':
        case 'symbol':
        case 'boolean':
        case 'function':
        case 'undefined': {
            return {changed: {prev, next}};
        }
        case 'object': {
            if (prev === null) return {changed: {prev, next}};
            if (prev === undefined) return {changed: {prev, next}};
            if (next === null) return {changed: {prev, next}};
            if (next === undefined) return {changed: {prev, next}};

            if (typeof next === 'object') {
                if (Array.isArray(prev) && Array.isArray(next)) {
                    const changes = {
                        moved: {} as Record<string | number | symbol, unknown>,
                        added: {} as Record<string | number | symbol, unknown>,
                        removed: {} as Record<string | number | symbol, unknown>,
                        changed: {} as Record<string | number | symbol, unknown>,
                    };
                    const prevMap = new Map(prev.map((prev, index, arr) => [mapper(prev, index, arr), {index, value: prev}]));
                    const nextMap = new Map(next.map((next, index, arr) => [mapper(next, index, arr), {index, value: next}]));

                    for (const [prevId, {value: prevValue}] of prevMap) {
                        if (!nextMap.has(prevId)) {
                            changes.removed[prevId] = {removed: prevValue};
                        }
                    }
                    for (const [nextId, {index: nextIndex, value: nextValue}] of nextMap) {
                        if (!prevMap.has(nextId)) {
                            changes.added[nextId] = {added: nextValue};
                        } else {
                            const {index: prevIndex, value: prevValue} = prevMap.get(nextId)!;

                            if (prevIndex !== nextIndex) {
                                changes.moved[nextId] = {from: prevIndex, to: nextIndex};
                            }
                            if (!equal(prevValue, nextValue)) {
                                changes.changed[nextId] = diff(prevValue, nextValue, {equal, mapper});
                            }
                        }
                    }
                    return {changed: {prev, next, changes}};
                } else if (!Array.isArray(prev) && !Array.isArray(next)) {
                    const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
                    const changes: Record<string, any> = {};

                    for (const key of keys) {
                        const hasPrev = key in prev;
                        const hasNext = key in next;
                        const prevValue = (prev as Record<string, unknown>)[key];
                        const nextValue = (next as Record<string, unknown>)[key];

                        if (!hasPrev) changes[key] = {added: nextValue};
                        else if (!hasNext) changes[key] = {removed: prevValue};
                        else if (!equal(prevValue, nextValue)) changes[key] = diff(prevValue, nextValue, {equal, mapper});
                    }
                    return {changed: {prev, next, changes}};
                }
            }
            return {changed: {prev, next}};
        }
        default: {
            return {changed: {prev, next}};
        }
    }
};
