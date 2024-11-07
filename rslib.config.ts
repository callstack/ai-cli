import { defineConfig } from '@rslib/core';

const shared = {
  source: {
    tsconfigPath: './tsconfig.build.json',
  },
};

export default defineConfig({
  lib: [
    {
      ...shared,
      format: 'esm',
      source: {
        entry: {
          bin: './src/bin.ts',
        },
      },
      output: {
        distPath: {
          root: './dist',
        },
      },
    },
  ],
  output: {
    target: 'node',
    minify: false,
  },
});
