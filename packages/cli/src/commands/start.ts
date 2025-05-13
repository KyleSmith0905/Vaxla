import { defineCommand } from 'citty';
import { getBaseScoreConfig, getBaseScoreConfigRaw, getBaseScoreVersion } from '../utilities/config';
import { resolve } from 'node:path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { getUiDirectory } from '@base_/shared';
import { runCommand } from '../utilities/command';
import { consola } from '../utilities/consola';
import { colors } from 'consola/utils';
import { startLoadingServer } from '../utilities/loading';

const shouldBuild = (cliVersion: string, config: string, dir: string): boolean => {
	const versionFile = resolve(dir, '.build/config-store');
	if (!existsSync(versionFile)) return true;

	try {
		const currentVersion = `${cliVersion}\n${config}`;
		const cachedVersion = readFileSync(versionFile, 'utf-8').trim();
		return currentVersion !== cachedVersion;
	} catch (error) {
		return true;
	}
};

const updateVersionFile = (cliVersion: string, config: string, dir: string) => {
	writeFileSync(resolve(dir, '.gitignore'), ['/.build/*'].join('\n'));

	const versionFile = resolve(dir, '.build/config-store');
	if (!existsSync(versionFile)) {
		mkdirSync(resolve(dir, '.build'), { recursive: true });
	}
	writeFileSync(versionFile, `${cliVersion}\n${config}`);
};

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
			default: './base_',
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
		},
	},
	async run({ args }) {
		const { port, dir, debug, open } = args;

		const { config } = await getBaseScoreConfig(dir);
		const finalPort = port ?? config.port ?? 3000;

		// Find the actual location of @base_/ui package
		const baseScoreUiPath = getUiDirectory();

		const configString = await getBaseScoreConfigRaw(dir);
		const cliVersion = await getBaseScoreVersion();

		process.env.BASE_SCORE_CONFIG = resolve(dir);

		// Build the UI if needed
		if (shouldBuild(cliVersion, configString, dir) || args.forceBuild) {
			consola.start('Building UI, this should only run once...');

			const loadingServer = startLoadingServer(finalPort, { open: open });

			await runCommand(
				'npx nuxi build',
				{
					cwd: baseScoreUiPath,
				},
				debug
			);

			loadingServer.close();

			updateVersionFile(cliVersion, configString, dir);
			consola.success('UI build complete. The build will not run again unless the config changes.');
		} else {
			consola.success('Reusing stored UI build.');
		}

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
			`npx nuxi start --port ${finalPort}`,
			{
				cwd: baseScoreUiPath,
			},
			debug
		);
	},
});
