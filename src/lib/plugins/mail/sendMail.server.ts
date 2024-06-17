import nodemailer from 'nodemailer';

import action from './sendMail';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({config}) {
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
        return {out: 'out', results: {}};
    },
});
