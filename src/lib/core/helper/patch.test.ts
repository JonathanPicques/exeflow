import {test, expect} from 'vitest';

import {diff} from './patch';

test('diff', () => {
    expect(diff(1, 1)).toStrictEqual({same: {prev: 1, next: 1}});
    expect(diff({}, {})).toStrictEqual({same: {prev: {}, next: {}}});
    expect(diff([], [])).toStrictEqual({same: {prev: [], next: []}});
    expect(diff(true, true)).toStrictEqual({same: {prev: true, next: true}});
    expect(diff(false, false)).toStrictEqual({same: {prev: false, next: false}});
    expect(diff('string', 'string')).toStrictEqual({same: {prev: 'string', next: 'string'}});

    expect(diff(1, 2)).toStrictEqual({changed: {prev: 1, next: 2}});
    expect(diff({}, [])).toStrictEqual({changed: {prev: {}, next: []}});
    expect(diff([], {})).toStrictEqual({changed: {prev: [], next: {}}});
    expect(diff(true, false)).toStrictEqual({changed: {prev: true, next: false}});
    expect(diff(false, true)).toStrictEqual({changed: {prev: false, next: true}});
    expect(diff('string', 'not same string')).toStrictEqual({changed: {prev: 'string', next: 'not same string'}});

    expect(diff([true], [true])).toStrictEqual({
        same: {
            prev: [true],
            next: [true],
        },
    });
    expect(diff([true], [false])).toStrictEqual({
        changed: {
            prev: [true],
            next: [false],
            changes: {
                moved: {},
                added: {},
                removed: {},
                changed: {
                    0: {changed: {prev: true, next: false}},
                },
            },
        },
    });
    expect(diff(['hello'], ['welcome', 'goodbye'])).toStrictEqual({
        changed: {
            prev: ['hello'],
            next: ['welcome', 'goodbye'],
            changes: {
                moved: {},
                added: {
                    1: {added: 'goodbye'},
                },
                removed: {},
                changed: {
                    0: {changed: {prev: 'hello', next: 'welcome'}},
                },
            },
        },
    });
    expect(diff(['hello', 'goodbye'], [])).toStrictEqual({
        changed: {
            prev: ['hello', 'goodbye'],
            next: [],
            changes: {
                moved: {},
                added: {},
                removed: {
                    0: {removed: 'hello'},
                    1: {removed: 'goodbye'},
                },
                changed: {},
            },
        },
    });

    const userMapper = (user: {id: string}) => user.id;

    expect(
        diff(
            [{id: 'pk_123', name: 'John'}],
            //
            [{id: 'pk_123', name: 'Jane'}],
            {mapper: userMapper},
        ),
    ).toStrictEqual({
        changed: {
            prev: [{id: 'pk_123', name: 'John'}],
            next: [{id: 'pk_123', name: 'Jane'}],
            changes: {
                moved: {},
                added: {},
                removed: {},
                changed: {
                    pk_123: {
                        changed: {
                            prev: {id: 'pk_123', name: 'John'},
                            next: {id: 'pk_123', name: 'Jane'},
                            changes: {
                                name: {changed: {prev: 'John', next: 'Jane'}},
                            },
                        },
                    },
                },
            },
        },
    });

    expect(
        diff(
            [
                {id: 'pk_123', name: 'John'},
                {id: 'pk_987', name: 'Jane'},
            ],
            [
                {id: 'pk_987', name: 'New Jane'},
                {id: 'pk_123', name: 'New John'},
            ],
            {mapper: userMapper},
        ),
    ).toStrictEqual({
        changed: {
            prev: [
                {id: 'pk_123', name: 'John'},
                {id: 'pk_987', name: 'Jane'},
            ],
            next: [
                {id: 'pk_987', name: 'New Jane'},
                {id: 'pk_123', name: 'New John'},
            ],
            changes: {
                moved: {
                    pk_123: {from: 0, to: 1},
                    pk_987: {from: 1, to: 0},
                },
                added: {},
                removed: {},
                changed: {
                    pk_123: {
                        changed: {
                            prev: {id: 'pk_123', name: 'John'},
                            next: {id: 'pk_123', name: 'New John'},
                            changes: {
                                name: {changed: {prev: 'John', next: 'New John'}},
                            },
                        },
                    },
                    pk_987: {
                        changed: {
                            prev: {id: 'pk_987', name: 'Jane'},
                            next: {id: 'pk_987', name: 'New Jane'},
                            changes: {
                                name: {changed: {prev: 'Jane', next: 'New Jane'}},
                            },
                        },
                    },
                },
            },
        },
    });
    expect(
        diff(
            [
                {id: 'pk_123', name: 'John'},
                {id: 'pk_987', name: 'Jane'},
                {id: 'pk_666', name: 'James'},
            ],
            [
                {id: 'pk_987', name: 'Jane'},
                {id: 'pk_123', name: 'John'},
                {id: 'pk_666', name: 'Boris', age: 32},
            ],
            {mapper: userMapper},
        ),
    ).toStrictEqual({
        changed: {
            prev: [
                {id: 'pk_123', name: 'John'},
                {id: 'pk_987', name: 'Jane'},
                {id: 'pk_666', name: 'James'},
            ],
            next: [
                {id: 'pk_987', name: 'Jane'},
                {id: 'pk_123', name: 'John'},
                {id: 'pk_666', name: 'Boris', age: 32},
            ],
            changes: {
                moved: {
                    pk_987: {from: 1, to: 0},
                    pk_123: {from: 0, to: 1},
                },
                added: {},
                removed: {},
                changed: {
                    pk_666: {
                        changed: {
                            prev: {id: 'pk_666', name: 'James'},
                            next: {id: 'pk_666', name: 'Boris', age: 32},
                            changes: {
                                age: {added: 32},
                                name: {changed: {prev: 'James', next: 'Boris'}},
                            },
                        },
                    },
                },
            },
        },
    });

    expect(
        diff(
            {age: 64, contact: {phone: '123'}, address: {city: 'Paris'}},
            //
            {name: 'John', contact: {email: 'john.doe@host.com'}, address: {city: 'Paris'}},
        ),
    ).toStrictEqual({
        changed: {
            prev: {age: 64, contact: {phone: '123'}, address: {city: 'Paris'}},
            next: {name: 'John', contact: {email: 'john.doe@host.com'}, address: {city: 'Paris'}},
            changes: {
                age: {removed: 64},
                name: {added: 'John'},
                contact: {
                    changed: {
                        prev: {phone: '123'},
                        next: {email: 'john.doe@host.com'},
                        changes: {
                            phone: {removed: '123'},
                            email: {added: 'john.doe@host.com'},
                        },
                    },
                },
            },
        },
    });
});
