import * as esbuild from 'esbuild';

import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess';


export let typescriptPreprocessor: PreprocessorGroup = {
	async script ({ content, filename, attributes }) {
		if (!(
			typeof attributes.lang == 'string' &&
			(/typescript|ts/).test(attributes.lang)
		)) return { code: content };

		let result = await esbuild.transform(content, {
			loader: 'ts',
			target: 'esnext',
			sourcefile: filename,
			tsconfigRaw: {
				compilerOptions: {
					importsNotUsedAsValues: 'preserve',
				},
			},
		});

		return { code: result.code };
	},
};
