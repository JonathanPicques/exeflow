import Mousetrap from 'mousetrap';

type ShortcutKeys = string | string[];
type ClickableElement = HTMLAnchorElement | HTMLButtonElement | HTMLInputElement;

/**
 * Registers an action that will call the click method on the given element if the given shortcut is pressed
 * @param element - clickable element
 * @param shortcut - the shortcut
 */
export const shortcut = (element: ClickableElement, shortcut: ShortcutKeys) => {
    const trap = new Mousetrap();
    const action = {
        update(shortcut: ShortcutKeys) {
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
