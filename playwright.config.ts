import {defineConfig} from '@playwright/test';

export default defineConfig({
    testDir: 'e2e',
    webServer: {
        port: 5173,
        command: 'pnpm run build && pnpm run preview',
        reuseExistingServer: true,
    },
});
