import { createJiti } from 'jiti';
import type { BaseScoreConfig } from '@base_/shared';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import consola from 'consola';

export const defineBaseScoreConfig = (config: BaseScoreConfig) => {
	return config;
};

export const getBaseScoreConfig = async (configPath: string): Promise<{ config: BaseScoreConfig; path: string }> => {
	const jiti = createJiti(import.meta.url);

	const path = resolve(configPath, 'config.ts');

	const config = await jiti.import(path, { default: true });

	return { config: config as BaseScoreConfig, path };
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
