import {RecursiveUrlLoader} from '@langchain/community/document_loaders/web/recursive_url';

import action from './crawl';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: async function* ({next, config}) {
        const loader = new RecursiveUrlLoader(config.url, {
            timeout: config.timeout,
            maxDepth: config.depth,
        });
        const pages = await loader.load();

        yield* next({output: 'out', results: {pages}});
    },
});
