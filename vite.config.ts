import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        watch: false,
        include: ['src/**/*.{test,spec}.{js,ts}'],
        typecheck: {
            enabled: true,
            ignoreSourceErrors: true,
        },
    },
    plugins: [sveltekit() as any], // TODO: Remove me when fixed
});
