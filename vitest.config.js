import { defineConfig } from 'vitest/config';

export default defineConfig({
    define: {
        'import.meta.env.PROD': false,
        'import.meta.env.DEV': true,
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.test.ts'],
    },
});
