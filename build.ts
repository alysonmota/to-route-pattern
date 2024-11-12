import type { BuildConfig } from 'bun'
import isolatedDecl from 'bun-plugin-isolated-decl'

const baseBuildConfig = {
	entrypoints: ['index.ts'],
	target: 'node',
	minify: true,
	sourcemap: 'inline',
	outdir: 'out',
} satisfies BuildConfig

await Promise.all([
	Bun.build({
		entrypoints: ['index.ts'],
		plugins: [isolatedDecl()],
	}),
	Bun.build({
		...baseBuildConfig,
		format: 'esm',
		naming: '[dir]/[name].mjs',
	}),
	Bun.build({
		...baseBuildConfig,
		format: 'cjs',
		naming: '[dir]/[name].cjs',
	}),
])
