import { runCommand } from 'nuxi';
import { defineCommand } from 'citty';
import { getBaseScoreConfig, getBaseScoreConfigRaw, getBaseScoreVersion } from '../utilities/config';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { consola } from 'consola';

const require = createRequire(import.meta.url);

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

		const configString = await getBaseScoreConfigRaw(dir);
		const cliVersion = await getBaseScoreVersion();

		process.env.BASE_SCORE_CONFIG = resolve(dir);

		// Build the UI if needed
		if (shouldBuild(cliVersion, configString, dir)) {
			consola.info('Building UI, this should only run once.');
			await runCommand('build', ['--port', finalPort, '--cwd', baseScoreUiPath], {
				overrides: { runtimeConfig: { public: { baseScoreConfig: config } } },
			});

			updateVersionFile(cliVersion, configString, dir);
			consola.info('UI build complete. The build will not run again unless the config changes.');
		} else {
			consola.info('Reusing stored UI.');
		}

		consola.info('Running server...');
		await runCommand('start', ['--port', finalPort, '--cwd', baseScoreUiPath], {
			overrides: { runtimeConfig: { public: { baseScoreConfig: config } } },
		});
	},
});
