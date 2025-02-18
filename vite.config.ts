import {sveltekit} from '@sveltejs/kit/vite';
import {loadEnv, defineConfig} from 'vite';

import {sveltekitOpenapi} from './vite.plugins';

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '');
    const disableOpenapiVitePlugin = env.EXEFLOW_DISABLE_OPENAPI_VITE_PLUGIN === 'true';

    return {
        test: {
            watch: false,
            include: ['src/**/*.{test,spec}.{js,ts}'],
            typecheck: {
                enabled: true,
                ignoreSourceErrors: true,
            },
        },
        plugins: [
            sveltekit(),
            disableOpenapiVitePlugin
                ? undefined
                : sveltekitOpenapi({
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
    };
});
