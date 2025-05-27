// Copied from https://github.com/brycesteve/nuxtSSE/blob/main/src/runtime/server/serverEvents.get.ts

import { useServerEvents } from '../utils/composables/useServerEvents';
import { defineEventHandler, setHeader, setResponseStatus, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
	setHeader(event, 'content-type', 'text/event-stream');
	setHeader(event, 'cache-control', 'no-cache');
	setHeader(event, 'connection', 'keep-alive');
	setResponseStatus(event, 200);

	const { addClient, close } = useServerEvents();

	const { clientId } = getQuery(event);

	addClient({
		id: clientId,
		response: event.node.res,
	});

	// Let the connection opened
	event._handled = true;
	event.node.req.on('close', () => {
		close(event.node.res);
	});

	return {};
});
