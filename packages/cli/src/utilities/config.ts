import { createJiti } from 'jiti';
import { writeFileRecursive, type BaseScoreConfig } from '@base_/shared';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, relative, resolve } from 'path';
import consola from 'consola';
import { globSync } from 'glob';

export const defineBaseScoreConfig = (config: BaseScoreConfig) => {
	return config;
};

export const getBaseScoreConfig = async (configPath: string): Promise<{ config: BaseScoreConfig; path: string }> => {
	if (configPath === undefined) {
		const config = {
			packages: {},
		} as BaseScoreConfig;

		const globResult = globSync('**/package.json', { ignore: ['**/node_modules/**'], absolute: true });
		globResult.map((packageJsonPath) => {
			const relativePath = dirname(relative(process.cwd(), packageJsonPath));
			const packageJsonString = readFileSync(packageJsonPath, { encoding: 'utf-8' });
			const packageJson = JSON.parse(packageJsonString);
			config.packages[relativePath === '.' ? 'root' : relativePath] = {
				name: packageJson.name ?? (relativePath === '.' ? 'root' : relativePath),
				path: relativePath,
				scripts: Object.keys(packageJson.scripts).map((key) => {
					return {
						label: key,
						command: { npm: key },
					};
				}),
			};
		});

		let configString = JSON.stringify(config, null, '\t');
		writeFileRecursive('./.base_/configless/config.ts', `export default ${configString}`);

		try {
			const gitIgnore = readFileSync('./.gitignore', { encoding: 'utf-8' });
			if (!gitIgnore.includes('\n/.base/*')) writeFileSync('./.gitignore', `${gitIgnore}\n# BASE_ Internals\n/.base/*`);
		} catch {
			consola.info('Suggestion: Add /.base/* to .gitignore to prevent committing the configless information.');
		}

		return { config: config, path: './.base_/configless/config.ts' };
	} else {
		const jiti = createJiti(import.meta.url);

		const path = resolve(configPath, 'config.ts');

		const config = await jiti.import(path, { default: true }).catch((e) => {
			if (e.code === 'MODULE_NOT_FOUND') throw new Error(`Could not find the BASE_ config, searching "${path}"`);
		});
		return { config: config as BaseScoreConfig, path };
	}
};

export const getBaseScoreVersion = async (): Promise<string> => {
	return (await import('../../package.json')).version;
};

export const getBaseScoreConfigRaw = async (configPath: string): Promise<string> => {
	const fullPath = resolve(configPath, 'config.ts');
	try {
		return readFileSync(fullPath, 'utf-8').trim();
	} catch (error) {
		const typedError = error as NodeJS.ErrnoException;
		if (typedError.code === 'ENOENT') {
			consola.error(`Error: Config file not found at ${fullPath}`);
		} else if (typedError.code === 'EISDIR') {
			consola.error(
				`Error: Expected a file path but got a directory path: ${fullPath}. Ensure you specified the directory containing the configuration folder.`
			);
		} else {
			consola.error(`Error reading config file at ${fullPath}:`, typedError);
		}

		throw typedError;
	}
};
