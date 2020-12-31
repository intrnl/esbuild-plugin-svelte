# esbuild-plugin-svelte

Compile Svelte components with esbuild

## Usage

```sh
npm install --save-dev @intrnl/esbuild-plugin-svelte
# pnpm install --save-dev @intrnl/esbuild-plugin-svelte
# yarn add --dev @intrnl/esbuild-plugin-svelte
```

```js
import esbuild from 'esbuild';
import { svelte } from '@intrnl/esbuild-plugin-svelte';

esbuild.build({
  bundle: true,
  // ...
  plugins: [
    svelte({
      // Enable built-in TypeScript preprocessing, defaults to true
      typescript: true,
      // Svelte preprocessors, make sure it is an array
      preprocess: [],
      // Svelte compiler options
      compilerOptions: {},
    }),
  ],
});
```
