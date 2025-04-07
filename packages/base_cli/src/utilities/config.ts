import { createJiti } from 'jiti';
import { resolve } from 'path';
import type { BaseScoreConfig } from 'base_shared';

export const defineBaseScoreConfig = (config: BaseScoreConfig) => {
	return config;
};

export const getBaseScoreConfig = async (path: string): Promise<{ config: BaseScoreConfig; path: string }> => {
	const jiti = createJiti(import.meta.url);

	const configPath = resolve(path, 'config.ts');
	const config = await jiti.import(configPath, { default: true });

	return { config: config as BaseScoreConfig, path: configPath };
};
