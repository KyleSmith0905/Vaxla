import { portToPid } from 'pid-port';
import fkill from 'fkill';

export default defineEventHandler(async (event) => {
	const query = getQuery<{ process: string } | { port: string }>(event);
	const isPort = 'port' in query;

	const signal = getQuery<{ signal: 'SIGKILL' | 'SIGTERM' }>(event).signal;

	const processId = isPort ? ((await portToPid(Number(query.port))) ?? `:${query.port}`) : query.process;

	return fkill(processId, { force: signal === 'SIGKILL', tree: true }).catch((e: AggregateError) => {
		throw createError({
			statusCode: 400,
			message: e.message.split('\n')[1].trim(),
		});
	});
});
