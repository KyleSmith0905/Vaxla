import { defineCommand } from 'citty';
import { getBaseScoreConfig, getBaseScoreVersion } from '../utilities/config';
import { resolve } from 'node:path';
import { getUiDirectory } from '@base_/shared';
import { runCommand } from '../utilities/command';
import { consola } from '../utilities/consola';
import { colors } from 'consola/utils';
import { default as openUrl } from 'open';

export default defineCommand({
	meta: {
		name: 'start',
		description: 'Starts BASE_ regular server. Runs a build command if needed, then starts a server.',
	},
	args: {
		port: {
			type: 'string',
			description: 'The port to run the server on.',
			alias: 'p',
		},
		dir: {
			type: 'string',
			description: 'The path to the base_ files, such as the configuration file.',
			alias: 'd',
		},
		forceBuild: {
			type: 'boolean',
			description: 'Whether to force a build or not.',
			alias: 'fb',
		},
		debug: {
			type: 'boolean',
			description: 'Enable debug logging for the UI build and start processes.',
			default: false,
		},
		open: {
			type: 'boolean',
			description: 'Open the browser when the server starts.',
			default: true,
			alias: 'o',
		},
	},
	async run({ args }) {
		try {
			const { port, dir, debug, open } = args;

			const cliVersion = await getBaseScoreVersion();
			consola.info(`Version: ${colors.yellow(cliVersion)}.`);

			const { config, path } = await getBaseScoreConfig(dir);
			const finalPort = port ?? config.port ?? 3000;

			// Find the actual location of @base_/ui package
			const baseScoreUiPath = getUiDirectory();

			const configDirectory = resolve(path, '..');

			process.env.BASE_SCORE_CONFIG = configDirectory;

			consola.start('Running server...');

			consola.box(
				[
					`Server running locally on port ${colors.yellowBright(finalPort)}.`,
					`View at ${colors.blueBright(colors.underline(`http://localhost:${finalPort}`))}`,
				].join('\n'),
				{
					title: 'Server Active',
					style: {
						borderColor: 'green',
						borderStyle: 'rounded',
					},
				}
			);

			runCommand(
				`node .output/server/index.mjs`,
				{
					cwd: baseScoreUiPath,
				},
				debug
			);

			if (open) openUrl(`http://localhost:${finalPort}`);
		} catch (error) {
			consola.error((error as any).message);
		}
	},
});
