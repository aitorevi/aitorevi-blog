import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
  define: {
    'import.meta.env.PROD': false,
    'import.meta.env.DEV': true,
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
});
