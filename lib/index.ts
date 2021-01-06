import * as fs from 'fs/promises';
import * as compiler from 'svelte/compiler';

import { typescriptPreprocessor } from './typescript';

import type { Plugin, PartialMessage as ESBuildMessage } from 'esbuild';
import type { CompileOptions, Warning as SvelteWarning } from 'svelte/types/compiler/interfaces';
import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess';


export function svelte (options: PluginOptions = {}): Plugin {
	let { compilerOptions = {}, preprocess = [], typescript = true } = options;

	if (typescript) {
		preprocess = [typescriptPreprocessor, ...preprocess];
	}

	return {
		name: 'svelte',
		setup (build) {
			let cssMap: Map<string, string> = new Map();

			build.onLoad({ filter: /\.svelte$/i }, async ({ path: filename }) => {
				let source = await fs.readFile(filename, 'utf-8');

				let finalCompileOptions: CompileOptions = {
					css: false,
					...compilerOptions,
					filename,
					format: 'esm',
				};

				if (preprocess.length) {
					let processed = await compiler.preprocess(source, preprocess, {
						filename,
					});

					source = processed.code;
					if (processed.map) finalCompileOptions.sourcemap = processed.map;
				}

				try {
					let result = compiler.compile(source, finalCompileOptions);
					let { js, css, warnings } = result;

					if (!finalCompileOptions.css && css?.code) {
						js.code = `import "${filename}?css";\n` + js.code;
						cssMap.set(filename, css.code);
					}

					return { contents: js.code, warnings: warnings.map(convertMessage) };
				} catch (e) {
					return { errors: [convertMessage(e)] };
				}

				function convertMessage (msg: SvelteWarning): ESBuildMessage {
					let { message, start, end } = msg;
					let location: undefined | ESBuildMessage['location'];

					if (start && end) {
						let lineText = source.split(/\r\n|\r|\n/g)[start.line];
						let lineEnd = start.line == end.line ? end.column : lineText.length;

						location = {
							file: filename,
							line: start.line,
							column: start.column,
							length: lineEnd - start.column,
							lineText,
						};
					}

					return { text: message, location };
				}
			});

			build.onLoad({ filter: /\.svelte\?css$/i }, ({ path: filename }) => {
				filename = filename.slice(0, -4);

				let css = cssMap.get(filename);
				if (!css) return null;

				return { contents: css, loader: 'css' };
			});
		},
	};
}

export interface PluginOptions {
	compilerOptions?: CompileOptions,
	preprocess?: PreprocessorGroup[],
	typescript?: boolean,
}
