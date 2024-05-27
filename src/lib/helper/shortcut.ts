import Mousetrap from 'mousetrap';

type ShortcutOptions = [string | string[], () => void];

export const shortcut = (_: HTMLElement, options: ShortcutOptions) => {
    const trap = new Mousetrap();
    const action = {
        update([keys, handler]: ShortcutOptions) {
            trap.reset();
            trap.bind(keys, e => {
                e.preventDefault();
                handler();
            });
        },
        destroy() {
            trap.reset();
        },
    };

    action.update(options);
    return action;
};
