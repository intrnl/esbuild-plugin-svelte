import esbuild from 'esbuild';

let externalPlugin = {
	name: 'external',
	setup (build) {
		build.onResolve({ filter: /^[^\.]/ }, (args) => (
			{ path: args.path, external: true }
		));
	},
};


esbuild.build({
	bundle: true,
	entryPoints: ['lib/index.ts'],
	outfile: 'dist/esbuild-plugin-svelte.mjs',
	format: 'esm',
	target: 'es2018',
	plugins: [externalPlugin],
});

esbuild.build({
	bundle: true,
	entryPoints: ['lib/index.ts'],
	outfile: 'dist/esbuild-plugin-svelte.js',
	format: 'cjs',
	target: 'esnext',
	plugins: [externalPlugin],
});
