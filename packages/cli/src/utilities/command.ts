import { exec } from 'node:child_process';
import { startLog } from './consola';

export const runCommand = (command: string, options: { cwd?: string; env?: Record<string, string> }, debug: boolean) => {
	return new Promise<void>((resolve) => {
		const { cwd } = options;

		const env: NodeJS.ProcessEnv = { ...process.env, ...options.env };
		const child = exec(command, { cwd, env });

		const log = startLog(command);

		if (debug) {
			child.stdout?.on('data', (data) => log.log(data));

			child.stderr?.on('data', (data) => {
				log.error(data);
			});
		}

		child.on('close', () => {
			if (debug) log.end();
			resolve();
		});
	});
};
