import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createJiti } from 'jiti';
import type { VaxlaConfig } from './types';

export const getVaxlaConfig = async (configPath: string) => {
	const jiti = createJiti(pathToFileURL(process.cwd()).href, { debug: true });
	
	const configurationFile = resolve(configPath, 'config.ts');
	const configurationFileUrl = pathToFileURL(configurationFile).toString();
	
	const config = (await jiti.import(configurationFileUrl)) as { default: VaxlaConfig };

	return config.default;
};