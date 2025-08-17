import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['./src/index.ts', './src/utilities/config/index.ts'],
	declaration: true,
});
