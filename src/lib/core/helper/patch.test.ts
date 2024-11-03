import {test, expect} from 'vitest';

import {diff} from './patch';

test('diff', () => {
    expect(diff(1, 1)).toStrictEqual({same: {prev: 1, next: 1}});
    expect(diff({}, {})).toStrictEqual({same: {prev: {}, next: {}}});
    expect(diff([], [])).toStrictEqual({same: {prev: [], next: []}});
    expect(diff(true, true)).toStrictEqual({same: {prev: true, next: true}});
    expect(diff(false, false)).toStrictEqual({same: {prev: false, next: false}});
    expect(diff('string', 'string')).toStrictEqual({same: {prev: 'string', next: 'string'}});

    expect(diff(1, 2)).toStrictEqual({changed: {value: {prev: 1, next: 2}}});
    expect(diff({}, [])).toStrictEqual({changed: {value: {prev: {}, next: []}}});
    expect(diff([], {})).toStrictEqual({changed: {value: {prev: [], next: {}}}});
    expect(diff(true, false)).toStrictEqual({changed: {value: {prev: true, next: false}}});
    expect(diff(false, true)).toStrictEqual({changed: {value: {prev: false, next: true}}});
    expect(diff('string', 'not same string')).toStrictEqual({changed: {value: {prev: 'string', next: 'not same string'}}});

    expect(diff([true], [true])).toStrictEqual({same: {prev: [true], next: [true]}});
    expect(diff([true], [false])).toStrictEqual({
        changed: {
            array: {
                moved: {},
                added: {},
                removed: {},
                modified: {
                    0: {changed: {value: {prev: true, next: false}}},
                },
            },
        },
    });
    expect(diff(['hello'], ['welcome', 'goodbye'])).toStrictEqual({
        changed: {
            array: {
                moved: {},
                added: {
                    1: 'goodbye',
                },
                removed: {},
                modified: {
                    0: {changed: {value: {prev: 'hello', next: 'welcome'}}},
                },
            },
        },
    });
    expect(diff(['hello', 'goodbye'], [])).toStrictEqual({
        changed: {
            array: {
                moved: {},
                added: {},
                removed: {
                    0: 'hello',
                    1: 'goodbye',
                },
                modified: {},
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
            array: {
                moved: {},
                added: {},
                removed: {},
                modified: {
                    pk_123: {
                        changed: {
                            object: {
                                name: {changed: {value: {prev: 'John', next: 'Jane'}}},
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
            array: {
                moved: {
                    pk_123: {from: 0, to: 1},
                    pk_987: {from: 1, to: 0},
                },
                added: {},
                removed: {},
                modified: {
                    pk_123: {
                        changed: {
                            object: {
                                name: {changed: {value: {prev: 'John', next: 'New John'}}},
                            },
                        },
                    },
                    pk_987: {
                        changed: {
                            object: {
                                name: {changed: {value: {prev: 'Jane', next: 'New Jane'}}},
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
            array: {
                moved: {
                    pk_987: {from: 1, to: 0},
                    pk_123: {from: 0, to: 1},
                },
                added: {},
                removed: {},
                modified: {
                    pk_666: {
                        changed: {
                            object: {
                                age: {added: 32},
                                name: {changed: {value: {prev: 'James', next: 'Boris'}}},
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
            object: {
                age: {removed: 64},
                name: {added: 'John'},
                contact: {
                    changed: {
                        object: {
                            phone: {removed: '123'},
                            email: {added: 'john.doe@host.com'},
                        },
                    },
                },
            },
        },
    });
});
