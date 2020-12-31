let esbuild = require('esbuild');
let { svelte } = require('../dist/esbuild-plugin-svelte');


process.chdir(__dirname);

esbuild.build({
	bundle: true,
	entryPoints: ['src/index.js'],
	outdir: 'dist/',
	format: 'esm',
	plugins: [svelte()],
});
