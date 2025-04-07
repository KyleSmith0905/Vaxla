import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['./src/index.ts', './src/command.ts'],
	declaration: true,
	rollup: {
		emitCJS: true,
	},
});
