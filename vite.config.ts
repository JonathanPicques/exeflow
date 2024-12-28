import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vitest/config';

import {sveltekitOpenapi} from './vite.plugins';

export default defineConfig({
    test: {
        watch: false,
        include: ['src/**/*.{test,spec}.{js,ts}'],
        typecheck: {
            enabled: true,
            ignoreSourceErrors: true,
        },
    },
    plugins: [
        sveltekit() as any, // TODO: Remove as any when fixed
        sveltekitOpenapi({
            openapi: {
                info: {
                    title: 'Exeflow API',
                    version: '0.1.0',
                    description: 'API documentation for the Exeflow project',
                },
                servers: [{url: 'http://localhost:5173'}, {url: 'https://exeflow.vercel.app/'}],
                components: {
                    securitySchemes: {
                        cookieAuth: {
                            in: 'cookie',
                            type: 'apiKey',
                            name: 'exeflow_session',
                        },
                    },
                },
            },
            include: ['**/*.ts', '!**/*.test*.ts', '!**/*.svelte*.ts'],
        }),
    ],
});
