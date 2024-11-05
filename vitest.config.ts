import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    poolOptions: {
      threads: {
        maxThreads: 2,
      },
    },
  },
});
