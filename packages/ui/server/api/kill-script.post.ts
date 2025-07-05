import { activeProcesses } from '../utils/cli';
import treeKill from 'tree-kill';

export default defineEventHandler(async (event) => {
	const body = (await readBody(event)) as { id: string };

	const process = activeProcesses[body.id];

	if (process) {
		treeKill(process.pid!);
		delete activeProcesses[body.id];
	} else throw createError({ statusCode: 400, statusMessage: `Could not find script by id "${body.id}".` });

	return {};
});
