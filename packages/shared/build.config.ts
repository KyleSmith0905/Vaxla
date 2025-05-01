import { defineBuildConfig } from 'unbuild';
import { cpSync } from 'fs';

export default defineBuildConfig({
	entries: ['./src/index.ts', './src/command.ts'],
	declaration: true,
	rollup: {
		emitCJS: true,
	},
	hooks: {
		'build:done': () => {
			cpSync('./dist/', '../ui/.base_/shared', {recursive: true})
		}
	}
});
