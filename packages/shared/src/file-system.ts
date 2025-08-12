import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { copyFileSync } from 'node:fs';

const require = createRequire(process.argv[1] ? new URL(process.argv[1], "file://").href : import.meta.url);

export const normalizePath = (path: string) => {
	return path.replaceAll('\\', '/');
};

export const getUserRootDirectory = () => {
	const configDir = process.env.VAXLA_CONFIG ?? process.cwd();
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
	const vaxlaUiPath = dirname(require.resolve('@vaxla/ui/package.json'));
	return vaxlaUiPath;
};

export const writeFileRecursive = (filePath: string, content: string): void => {
	const directory = dirname(filePath);
	mkdirSync(directory, { recursive: true });
	writeFileSync(filePath, content);
};

export const copyFileRecursive = async (source: string, destination: string): Promise<void> => {
	const directory = dirname(destination);
	mkdirSync(directory, { recursive: true });
	
	copyFileSync(source, destination);
};