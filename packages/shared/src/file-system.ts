import { existsSync } from 'fs';
import { join, resolve } from 'path';

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
