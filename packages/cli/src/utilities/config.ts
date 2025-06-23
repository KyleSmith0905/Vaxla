import { createJiti } from 'jiti';
import { writeFileRecursive, type VaxlaConfig } from '@vaxla/shared';
import { readFileSync, writeFileSync, existsSync, lstatSync } from 'fs';
import { dirname, relative, resolve } from 'path';
import consola from 'consola';
import { globSync } from 'glob';
import { findUpSync, findUpMultipleSync } from 'find-up';

export const defineVaxlaConfig = (config: VaxlaConfig) => {
	return config;
};

const getVaxlaConfig = async (configPath: string) => {
	// Normalize the path to correct for people entering /vaxla/config.ts instead of /vaxla.
	const isDirectory = lstatSync(configPath).isDirectory();
	let path = isDirectory ? resolve(configPath, 'config.ts') : resolve(configPath);

	const jiti = createJiti(import.meta.url);

	const config = await jiti.import(path, { default: true }).catch((e) => {
		if (e.code === 'MODULE_NOT_FOUND') throw new Error(`Could not find the Vaxla config, searching "${path}"`);
	});
	return { config: config as VaxlaConfig, path: path };
};

/**
 * Infers the location of the Vaxla config in a 3-step order.
 * If we cannot find a config, we'll generate one based on their environment setup.
 */
export const inferVaxlaConfig = async (configPath?: string): Promise<{ config: VaxlaConfig; path: string }> => {
	// 1. The user defines configuration path within the CLI.
	if (configPath !== undefined) return await getVaxlaConfig(configPath);

	// 2. The user defines configuration path within the package.json.
	const packageJsonList = findUpMultipleSync('package.json');
	for (const packageJsonPath of packageJsonList) {
		const packageJsonString = readFileSync(packageJsonPath, 'utf-8');
		const packageJson = JSON.parse(packageJsonString);
		const configPath = packageJson?.vaxla?.config;

		if (!configPath) continue;

		return await getVaxlaConfig(resolve(dirname(packageJsonPath), configPath));
	}

	// 3. The user has the configuration path in a common location.
	const plausibleConfigList = findUpMultipleSync(['vaxla', 'tools/vaxla'], { type: 'directory' });
	for (const plausibleConfigPath of plausibleConfigList) {
		const path = existsSync(resolve(plausibleConfigPath, 'config.ts'));
		if (path) return await getVaxlaConfig(plausibleConfigPath);
	}

	// 4. We generate a default configuration graph.
	const config = {
		packages: {},
	} as VaxlaConfig;

	const globResult = globSync('**/package.json', { ignore: ['**/node_modules/**'], absolute: true });
	globResult.map((packageJsonPath) => {
		const relativePath = dirname(relative(process.cwd(), packageJsonPath));
		const packageJsonString = readFileSync(packageJsonPath, { encoding: 'utf-8' });
		const packageJson = JSON.parse(packageJsonString);

		const scripts = Object.entries(packageJson.scripts).map(([key, value]) => {
			return [
				key,
				{
					label: key,
					command: { npm: value },
				},
			];
		});

		config.packages[relativePath === '.' ? 'root' : relativePath] = {
			name: packageJson.name ?? (relativePath === '.' ? 'root' : relativePath),
			path: relativePath,
			scripts: Object.fromEntries(scripts),
		};
	});

	let configString = JSON.stringify(config, null, '\t');
	writeFileRecursive('./.vaxla/configless/config.json', configString);

	try {
		const gitIgnore = readFileSync('./.gitignore', { encoding: 'utf-8' });
		if (!gitIgnore.includes('\n/.vaxla/*')) writeFileSync('./.gitignore', `${gitIgnore}\n# Vaxla Internals\n/.vaxla/*`);
	} catch {
		consola.info('Suggestion: Add /.vaxla/* to .gitignore to prevent committing the configless information.');
	}

	return { config: config, path: './.vaxla/configless/config.json' };
};

export const getVaxlaVersion = async (): Promise<string> => {
	const packageJsonPath = findUpSync('package.json', { cwd: import.meta.filename });
	const packageJsonString = readFileSync(packageJsonPath!, { encoding: 'utf-8' });
	const packageJson = JSON.parse(packageJsonString);
	return packageJson.version;
};

export const getVaxlaConfigRaw = async (configPath: string): Promise<string> => {
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
