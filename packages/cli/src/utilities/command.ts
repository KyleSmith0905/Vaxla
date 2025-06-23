import { exec } from 'node:child_process';
import { startLog } from './consola';

export const runCommand = (command: string, options: { cwd?: string; env?: Record<string, string> }, debug: boolean) => {
	return new Promise<void>((resolve, reject) => {
		const { cwd } = options;

		const env: NodeJS.ProcessEnv = { ...process.env, ...options.env };
		const child = exec(command, { cwd, env });

		const log = startLog(command);

		const handleExit = () => {
			child.kill('SIGTERM');
			process.exit(0);
		};

		// Listen for process termination signals
		process.on('SIGINT', handleExit);
		process.on('SIGTERM', handleExit);
		process.on('exit', () => child.kill('SIGTERM'));

		if (debug) {
			child.stdout?.on('data', (data) => log.log(data));

			child.stderr?.on('data', (data) => log.error(data));
		}

		const removeListeners = () => {
			process.off('SIGINT', handleExit);
			process.off('SIGTERM', handleExit);
			process.off('exit', () => child.kill('SIGTERM'));
		};

		child.on('close', (code) => {
			removeListeners();

			if (debug) log.end();

			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`Command exited with code ${code}`));
			}
		});

		child.on('error', (error) => {
			removeListeners();

			if (debug) log.end();
			reject(error);
		});
	});
};
