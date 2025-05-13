import { defineCommand } from 'citty';
import { getBaseScoreConfig } from '../utilities/config';
import { dirname, resolve, join } from 'node:path';
import chokidar from 'chokidar';
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, unlinkSync } from 'node:fs';
import { getUiDirectory } from '@base_/shared';
import { runCommand } from '../utilities/command';
import { consola } from '../utilities/consola';
import { pollUrl } from '../utilities/polling';
import { colors } from 'consola/utils';

export default defineCommand({
	meta: {
		name: 'dev',
		description: 'Run BASE_ development server',
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
		debug: {
			type: 'boolean',
			description: 'Enable debug logging for the UI dev processes.',
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

			const { config, path } = await getBaseScoreConfig(dir);

			const finalPort = port ?? config.port ?? 3000;

			// Find the actual location of @base_/ui package
			const baseScoreUiPath = getUiDirectory();

			const configDirectory = resolve(path, '..');
			process.env.BASE_SCORE_CONFIG = configDirectory;

			// Remove non-internal files in @base_/ui
			const publicPath = join(baseScoreUiPath, 'public');
			readdirSync(publicPath).forEach((file) => {
				if (!file.startsWith('base_internal')) {
					rmSync(join(publicPath, file), { recursive: true, force: true });
				}
			});

			// Watches the public directory and copies the content to the @base_/ui package
			chokidar
				.watch('public', {
					ignored: [/public\/base_internal\//],
					cwd: configDirectory,
				})
				.on('all', async (event, filePath) => {
					const configPath = join(configDirectory, filePath);
					const uiPath = join(baseScoreUiPath, filePath);
					const uiDir = dirname(uiPath);

					if (event === 'add' || event === 'change') {
						if (!existsSync(uiDir)) mkdirSync(uiDir, { recursive: true });
						copyFileSync(configPath, uiPath);
					}
					if (event === 'unlink') {
						unlinkSync(uiPath);
					}
				});

			consola.start('Starting development server...');
			await runCommand(
				`npx nuxi dev --port ${finalPort} ${open ? '--open' : ''}`,
				{
					cwd: baseScoreUiPath,
				},
				debug
			);

			await pollUrl(`https://localhost:${finalPort}`);

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
		} catch (error) {
			consola.error((error as any).message);
		}
	},
});
