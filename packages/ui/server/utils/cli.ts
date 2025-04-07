import { ChildProcess, spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { join } from 'path';
import { ActiveScript } from '~/utils/packages/types';

export const activeProcesses: Record<string, ChildProcess> = {};

const crossPlatformSpawn = (command: string, options: SpawnOptionsWithoutStdio) => {
	let file = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
	let args = process.platform === 'win32' ? ['/s', '/c', '"' + command + '"'] : ['-c', command];
	if (process.platform === 'win32') {
		options = Object.assign({}, options);
		options.windowsVerbatimArguments = true;
	}
	return spawn(file, args, options);
};

/**
 * A custom command executor with prefix support.
 * Code originated from {@link https://stackoverflow.com/a/46617356/13463861}
 */
export const execCommand = async (
	command: string,
	options?: {
		id?: string;
		onOutput?: (data: { message: string; type: ActiveScript['logs'][number]['type'] }) => void;
		onClose?: (data: number) => void;
		abortController?: AbortController;
	}
) => {
	let absolutePath = process.cwd();
	if (absolutePath.endsWith('welcome')) absolutePath = join(absolutePath, '..');
	if (absolutePath.endsWith('welcome\\.output')) absolutePath = join(absolutePath, '../..');
	if (absolutePath.endsWith('welcome/.output')) absolutePath = join(absolutePath, '../..');

	const childProcess = crossPlatformSpawn(command, {
		windowsHide: true,
		shell: false,
		detached: false,
		cwd: absolutePath,
		signal: options?.abortController?.signal,
		env: {
			...process.env,
			FORCE_COLOR: '1',
		},
	});
	if (options?.id) activeProcesses[options.id] = childProcess;

	childProcess.stdout?.on('data', async (data = '') => {
		if (options?.onOutput) options.onOutput({ message: data.toString('utf8'), type: 'log' });
	});

	childProcess.stderr?.on('data', (data = '') => {
		if (options?.onOutput) options.onOutput({ message: data.toString('utf8'), type: 'error' });
	});

	childProcess.on('exit', (data) => {
		if (options?.onClose) options.onClose(data ?? 0);
		if (options?.id) delete activeProcesses[options.id];
	});
};

/**
 * A custom command executor with prefix support.
 * Can be used as a promise if order of commands matters.
 */
export const execCommandPromise = (command: Parameters<typeof execCommand>[0], options?: Parameters<typeof execCommand>[1]) => {
	return new Promise((resolve) => {
		execCommand(command, {
			...options,
			onClose: resolve,
		});
	});
};
