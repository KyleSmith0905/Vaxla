import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';

const require = createRequire(import.meta.url);

export const getUserRootDirectory = () => {
	const configDir = process.env.BASE_SCORE_CONFIG ?? process.cwd();
	let currentDir = configDir;

	while (currentDir !== '/') {
		const parentDir = resolve(currentDir, '..');
		const packageJsonPath = join(parentDir, 'package.json');

		if (existsSync(packageJsonPath)) {
			return parentDir;
		}

		currentDir = parentDir;
	}

	return configDir;
};


export const getUiDirectory = () => {
	const baseScoreUiPath = dirname(require.resolve('@base_/ui/package.json'));
	return baseScoreUiPath;
}