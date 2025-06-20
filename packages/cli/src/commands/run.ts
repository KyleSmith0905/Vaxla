import { defineCommand } from 'citty';
import { inferVaxlaConfig, getVaxlaVersion } from '../utilities/config';
import { resolve } from 'node:path';
import { consola, startLog } from '../utilities/consola';
import { colors } from 'consola/utils';
import { execCommandPromise, getCommandShellScript, getUserRootDirectory } from '@vaxla/shared';

export default defineCommand({
	meta: {
		name: 'run',
		description: 'Run commands specified within the configuration file. Example: `vaxla run web dev --dir ./vaxla`.',
	},
	args: {
		package: {
			type: 'string',
			description: "A key of the vaxla config's `packages` record.",
			alias: 'p',
		},
		command: {
			type: 'string',
			description: 'An index or `id` to a command of a package.',
			alias: 'p',
		},
		dir: {
			type: 'string',
			description: 'The path to the vaxla files, such as the configuration file.',
			alias: 'd',
		},
	},
	async run({ args }) {
		try {
			const { dir, package: packageIdArg, command: commandArg } = args;
			const packageId = packageIdArg ?? (args._[0] as string);
			const command = commandArg ?? (args._[1] as string);

			const cliVersion = await getVaxlaVersion();
			consola.info(`Version: ${colors.yellow(cliVersion)}.`);

			const { config, path } = await inferVaxlaConfig(dir);

			const configDirectory = resolve(path, '..');
			process.env.VAXLA_CONFIG = configDirectory;

			const packageInfo = config.packages[packageId];
			if (!packageInfo) throw `Could not find package ${colors.gray(packageId)}.`;
			const script = packageInfo.scripts[command];
			if (!script) throw `Could not find command ${colors.gray(command)}.`;

			const shell = getCommandShellScript({ dynamic: script.command }, packageInfo?.path ?? '');
			const log = startLog(shell);

			const originalLog = console.log;
			console.log = (data) => log.log(data);
			const originalError = console.error;
			console.error = (data) => log.error(data);

			if (typeof script.command === 'object' && 'fn' in script.command && script.command.fn instanceof Function) {
				await script.command.fn();
			} else {
				const commandShell = script.command ? shell : '';
				await execCommandPromise(commandShell, {
					cwd: getUserRootDirectory(),
					onLog: (msg) => log.log(msg),
					onError: (msg) => log.error(msg),
				});
			}

			log.end();
			console.log = originalLog;
			console.error = originalError;
		} catch (error) {
			consola.error(typeof error === 'string' ? error : (error as any).message);
		}
	},
});
