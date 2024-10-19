import adapter from '@sveltejs/adapter-auto';
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
    },
    preprocess: vitePreprocess(),
    vitePlugin: {
        inspector: {
            toggleKeyCombo: 'shift-f',
            showToggleButton: 'never',
        },
    },
};

export default config;
