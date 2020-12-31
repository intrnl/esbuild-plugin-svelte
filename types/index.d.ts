import type { Plugin } from 'esbuild';
import type { CompileOptions } from 'svelte/types/compiler/interfaces';
import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess';
export declare function svelte(options?: PluginOptions): Plugin;
export interface PluginOptions {
    compilerOptions?: CompileOptions;
    preprocess?: PreprocessorGroup[];
    typescript?: boolean;
}
