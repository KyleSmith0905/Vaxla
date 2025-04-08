import { createJiti } from 'jiti';
import { dirname, resolve } from 'path';
import type { BaseScoreConfig } from '@base_/shared';
import { readFileSync } from 'fs';

export const defineBaseScoreConfig = (config: BaseScoreConfig) => {
	return config;
};

export const getBaseScoreConfig = async (dir: string): Promise<{ config: BaseScoreConfig; path: string }> => {
	const jiti = createJiti(import.meta.url);

	const configPath = resolve(dir, 'config.ts');
	const config = await jiti.import(configPath, { default: true });

	return { config: config as BaseScoreConfig, path: configPath };
};

export const getBaseScoreVersion = async (): Promise<string> => {
	return (await import('../../package.json')).version;
};

export const getBaseScoreConfigRaw = async (dir: string): Promise<string> => {
	return readFileSync(resolve(dir, 'config.ts'), 'utf-8').trim();
};
