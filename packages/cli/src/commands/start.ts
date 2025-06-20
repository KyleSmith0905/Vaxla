import { defineCommand } from 'citty';
import { inferVaxlaConfig, getVaxlaVersion } from '../utilities/config';
import { resolve } from 'node:path';
import { getUiDirectory } from '@vaxla/shared';
import { runCommand } from '../utilities/command';
import { consola } from '../utilities/consola';
import { colors } from 'consola/utils';
import { default as openUrl } from 'open';
import { platform } from 'os';

export default defineCommand({
	meta: {
		name: 'start',
		description: 'Starts Vaxla regular server. Runs a build command if needed, then starts a server.',
	},
	args: {
		port: {
			type: 'string',
			description: 'The port to run the server on.',
			alias: 'p',
		},
		dir: {
			type: 'string',
			description: 'The path to the vaxla files, such as the configuration file.',
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
			description: 'Open the app inside the default browser when the server starts.',
			default: true,
			alias: 'o',
		},
		desktop: {
			type: 'boolean',
			description: 'Open Vaxla inside of a desktop app.',
			default: false,
			alias: 'dt',
		},
	},
	async run({ args }) {
		try {
			const { port, dir, debug, open, desktop } = args;

			const cliVersion = await getVaxlaVersion();
			consola.info(`Version: ${colors.yellow(cliVersion)}.`);

			const { config, path } = await inferVaxlaConfig(dir);
			consola.info(`Config Path: ${colors.yellow(path)}.`);
			const finalPort = port ?? config.port ?? 3000;

			// Find the actual location of @vaxla/ui package
			const vaxlaUiPath = getUiDirectory();

			const configDirectory = resolve(path, '..');

			process.env.VAXLA_CONFIG = configDirectory;

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
					cwd: vaxlaUiPath,
				},
				debug
			);

			if (desktop) {
				if (platform() === 'win32') {
					runCommand(
						`start ./src-tauri/target/release/Vaxla.exe`,
						{
							cwd: vaxlaUiPath,
						},
						debug
					);
				} else {
					consola.error('Desktop mode is not supported on this platform, please support our development by contributing to the project.');
				}
			}

			if (open) openUrl(`http://localhost:${finalPort}`);
		} catch (error) {
			consola.error((error as any).message);
		}
	},
});
