import { createJiti } from 'jiti';
import type { BaseScoreConfig } from '@base_/shared';
import { readFileSync } from 'fs';
import { resolve } from 'path';

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
	return readFileSync(configPath, 'utf-8').trim();
};
