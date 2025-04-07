import { execCommandPromise } from '../utils/cli';
import { ScriptStatus } from '~/utils/packages/types';
import { activeProcesses } from '../utils/cli';
import { BaseScoreCommand, BaseScoreConfig, getBaseScoreConfig, getCommandDisplayName, getCommandShellScript } from 'base_shared';

export default defineEventHandler(async (event) => {
	const body = (await readBody(event)) as { id: string } & ({ command: BaseScoreCommand } | { commandIndex: number; packageId?: string });
	const { send } = useServerEvents();

	const configPath = process.env.BASE_SCORE_CONFIG;

	const config = typeof configPath === 'string' ? await getBaseScoreConfig(configPath) : ({} as BaseScoreConfig);
	const packageInfo = 'packageId' in body ? config.packages[body.packageId ?? ''] : undefined;
	const command = 'commandIndex' in body ? packageInfo?.scripts[body.commandIndex].command : body.command;

	const commandShell = command ? getCommandShellScript({ dynamic: command }, packageInfo?.path ?? '') : '';
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
	if (command instanceof Function) {
		startMessage('Executing Function');

		// Override console.log to send messages through the event system
		const originalConsoleLog = console.log;
		console.log = (...args) => {
			send({ data: { id: body.id, message: args.join(' '), type: 'log' } });
		};

		try {
			await command();
		} catch (error) {
			send({ data: { id: body.id, message: error instanceof Error ? error.message : (error as any).toString(), type: 'error' } });
		} finally {
			// Restore original console.log
			console.log = originalConsoleLog;
		}
		send({
			data: {
				id: body.id,
				message: '\x1b[1m| Script Finished',
				status: ScriptStatus.Closed,
				type: 'meta',
			},
		});
		return {};
	}

	// Handle shell scripts
	if (activeProcesses[body.id]) {
		startMessage('Sending Command');

		activeProcesses[body.id].send(commandShell);
	} else {
		startMessage('Executing Script');

		await execCommandPromise(commandShell, {
			id: body.id,
			onOutput: (msg) => {
				send({ data: { id: body.id, message: msg.message, type: msg.type } });
			},
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
