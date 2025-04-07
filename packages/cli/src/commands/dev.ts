import { runCommand } from 'nuxi';
import { defineCommand } from 'citty';
import { getBaseScoreConfig } from '../utilities/config';
import path, { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default defineCommand({
	meta: {
		name: 'dev',
		description: 'Run BASE_ development server',
	},
	args: {
		port: {
			type: 'string',
			description: 'The port to run the server on.',
		},
		dir: {
			type: 'string',
			description: 'The path to the base_ files, such as the configuration file.',
			default: './base_',
		},
	},
	async run({ args }) {
		const { port, dir } = args;

		const { config } = await getBaseScoreConfig(dir);

		const finalPort = port ?? config.port ?? 3000;

		// Find the actual location of @base_/ui package
		const baseScoreUiPath = dirname(require.resolve('@base_/ui/package.json'));

		process.env.BASE_SCORE_CONFIG = resolve(dir);

		await runCommand('dev', ['--port', finalPort, '--cwd', baseScoreUiPath], {
			overrides: { runtimeConfig: { public: { baseScoreConfig: config } } },
		});
	},
});
