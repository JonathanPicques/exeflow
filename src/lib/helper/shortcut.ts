import Mousetrap from 'mousetrap';

type Clickable = HTMLAnchorElement | HTMLButtonElement | HTMLInputElement;

export const shortcut = (element: Clickable, shortcut: string | string[]) => {
    const trap = new Mousetrap();
    const action = {
        update(shortcut: string | string[]) {
            trap.reset();
            trap.bind(shortcut, e => {
                e.preventDefault();
                element.click();
            });
        },
        destroy() {
            trap.reset();
        },
    };

    action.update(shortcut);
    return action;
};
