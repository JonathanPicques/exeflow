import {dev} from '$app/environment';

/**
 * @returns the url of the inbox for a given email.
 */
export const inboxFromEmail = (email: string): string | undefined => {
    if (dev) return `http://localhost:54324/monitor`;
    const [_, provider] = email.split('@');

    switch (provider.toLocaleLowerCase()) {
        case 'gmail.com':
            return 'https://mail.google.com';
        case 'outlook.com':
            return 'https://outlook.live.com/mail/';
    }
};
