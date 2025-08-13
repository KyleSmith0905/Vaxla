import { execCommandPromise, getUserRootDirectory } from '@vaxla/shared';
import { ScriptStatus } from '~/utils/packages/types';
import { activeProcesses } from '../utils/cli';
import { VaxlaCommand, VaxlaConfig, getVaxlaConfig, getCommandDisplayName, getCommandShellScript } from '@vaxla/shared';
import { useServerEvents } from '../utils/composables/useServerEvents';

export default defineEventHandler(async (event) => {
	const body = (await readBody(event)) as { id: string } & ({ command: VaxlaCommand } | { commandId: number; packageId?: string });
	const { send } = useServerEvents();

	const configPath = process.env.VAXLA_CONFIG;

	const config = typeof configPath === 'string' ? await getVaxlaConfig(configPath) : ({} as VaxlaConfig);
	const commandId = 'commandId' in body ? body.commandId : undefined;
	const packageId = 'packageId' in body ? body.packageId : undefined;
	const packageInfo = packageId ? config.packages[packageId] : undefined;
	const command = 'commandId' in body ? packageInfo?.scripts[body.commandId].command : body.command;

	let commandShell = command ? getCommandShellScript({ dynamic: command }, packageInfo?.path ?? '') : '';
	const commandName = command ? getCommandDisplayName({ dynamic: command }) : '';

	const startMessage = (message: string) => {
		send({
			data: {
				id: body.id,
				message: [
					`\x1b[1m| ${message}`,
					`\x1b[36;1mDate    \x1b[0m\x1b[36m${new Date().toISOString()}`,
					`\x1b[36;1mOptions \x1b[0m\x1b[36m${commandName}`,
					`\x1b[36;1mShell   \x1b[0m\x1b[36m${commandShell}`,
				].join('\n'),
				status: ScriptStatus.Opened,
			},
		});
	};

	// Handle functions
	if (typeof command === 'object' && 'fn' in command && command.fn instanceof Function) {
		commandShell = `vaxla run ${packageId} ${commandId}`;
	}

	// Handle shell scripts
	if (activeProcesses[body.id]) {
		startMessage('Sending Command');

		activeProcesses[body.id].send(commandShell);
	} else {
		startMessage('Executing Script');

		await execCommandPromise(commandShell, {
			cwd: getUserRootDirectory(),
			onLog: (msg) => send({ data: { id: body.id, message: msg, type: 'log', status: ScriptStatus.Opened } }),
			onError: (msg) => send({ data: { id: body.id, message: msg, type: 'error', status: ScriptStatus.Opened } }),
			onChildProcessInit: (childProcess) => (activeProcesses[body.id] = childProcess),
		});

		send({
			data: {
				id: body.id,
				message: '\x1b[1m| Script Killed',
				status: ScriptStatus.Closed,
				type: 'meta',
			},
		});
	}

	return {};
});
