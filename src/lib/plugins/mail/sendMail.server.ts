import sendMail from './sendMail';
import {actionServer} from '$lib/core/plugins/action.server';

export default actionServer(sendMail, {
    exec: async function* ({config}) {
        const {tls, host, port, user, password} = config;
        const {to, from, subject, bodyText, bodyHtml} = config;

        console.log({tls, host, port, user, password});
        console.log({to, from, subject, bodyText, bodyHtml});
        return {out: 'out', results: {}};
    },
});
