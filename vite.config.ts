/// <reference types="vitest" />

import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';

export default defineConfig({
    test: {
        watch: false,
        include: ['src/**/*.{test,spec}.{js,ts}'],
        typecheck: {
            enabled: true,
            ignoreSourceErrors: true,
        },
    },
    plugins: [sveltekit()],
});
