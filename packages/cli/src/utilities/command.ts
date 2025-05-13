import { exec } from 'node:child_process';
import consola from 'consola';
import { colors } from 'consola/utils';

export const runCommand = (command: string, options: { cwd?: string; env?: Record<string, string> }, debug: boolean) => {
	return new Promise<void>((resolve, reject) => {
		const { cwd } = options;

		const log = (message: string) => {
			process.stdout.write(`${colors.dim(message.trim())}\n`);
		};

		if (debug) log(colors.yellow(`╭────${command}─────`));

		const env: NodeJS.ProcessEnv = { ...process.env, ...options.env };

		const child = exec(command, {
			cwd,
			env,
		});

		if (debug) {
			child.stdout?.on('data', (data) => {
				data
					.toString()
					.split('\n')
					.forEach((e: string) => {
						if (!e) return;
						log(`${colors.yellow('│')} ${e}`);
					});
			});

			child.stderr?.on('data', (data) => {
				data
					.toString()
					.split('\n')
					.forEach((e: string) => {
						if (!e) return;
						log(`${colors.yellow('│')} ${e}`);
					});
			});
		}

		child.on('error', (error) => {
			consola.error(`Failed to start child process: ${error.message}`);
			reject(error);
		});

		child.on('close', () => {
			if (debug) log(colors.yellow(`╰────${command}─────`));
			resolve();
		});
	});
};
