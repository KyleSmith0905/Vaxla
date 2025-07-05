import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['./src/index.ts', './src/utilities/config.ts'],
	declaration: true,
});
