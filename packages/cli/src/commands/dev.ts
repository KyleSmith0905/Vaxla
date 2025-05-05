import { runCommand } from 'nuxi';
import { defineCommand } from 'citty';
import { getBaseScoreConfig } from '../utilities/config';
import { dirname, resolve, join } from 'node:path';
import chokidar from 'chokidar';
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, unlinkSync } from 'node:fs';
import { getUiDirectory } from '@base_/shared';

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
			default: './base_',
			alias: 'd',
		},
	},
	async run({ args }) {
		const { port, dir } = args;

		const { config } = await getBaseScoreConfig(dir);

		const finalPort = port ?? config.port ?? 3000;

		// Find the actual location of @base_/ui package
		const baseScoreUiPath = getUiDirectory();

		const configDirectory = resolve(dir);
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

		await runCommand('dev', ['--port', finalPort, '--cwd', baseScoreUiPath], {
			overrides: { runtimeConfig: { public: { baseScoreConfig: config } } },
		});
	},
});
