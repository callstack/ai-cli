import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  dev: { progressBar: false },
  source: {
    entry: {
      bin: './src/bin.ts',
    },
    tsconfigPath: './tsconfig.build.json',
  },
  output: {
    target: 'node',
    minify: false,
    filename: {
      js: '[name].cjs',
    },
    externals: ['react-devtools-core'],
  },
  tools: {
    rspack: {
      module: {
        parser: {
          javascript: {
            dynamicImportMode: 'eager',
          },
        },
      },
      resolve: {
        extensionAlias: {
          '.js': ['.js', '.ts', '.tsx'],
        },
      },
      ignoreWarnings: [
        /require function is used in a way in which dependencies cannot be statically extracted/,
        /the request of a dependency is an expression/,
        /Can't resolve 'bufferutil'/,
        /Can't resolve 'utf-8-validate'/,
      ],
    },
  },
});
