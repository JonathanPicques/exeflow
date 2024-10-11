import nodemailer from 'nodemailer';

import {serverAction} from '$lib/core/plugins/action.server';
import type action from './sendMail';

export default serverAction<typeof action>({
    exec: async function* ({next, config}) {
        const transport = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            auth: {
                user: config.user,
                pass: config.password,
            },
            secure: config.tls,
        });

        await transport.sendMail({
            to: config.to,
            from: config.from,
            subject: config.subject,
            //
            text: config.bodyText,
            html: config.bodyHtml,
        });

        yield* next({output: 'out', results: {}});
    },
});
