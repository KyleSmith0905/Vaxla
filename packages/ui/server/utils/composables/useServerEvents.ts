import type { IncomingMessage, ServerResponse } from 'http';

// Copied from https://github.com/brycesteve/nuxtSSE/blob/main/src/runtime/server/composables/useServerEvents.ts

/**
 *  An event sent to EventSource
 */
export interface ServerSentEvent {
	/** Custom event type - default is 'message' */
	event?: string;
	/** data sent to the client */
	data: any;
	/** Custom reconnection timeout */
	retry?: number;
}
function isServerSentEvent(data: object | string): data is ServerSentEvent {
	return (data as ServerSentEvent).data !== undefined;
}

interface Client {
	id?: any;
	response: ServerResponse<IncomingMessage>;
}

let clients: Client[] = [];

/**
 *
 * Server-side composable to send events to connected clients
 */
export const useServerEvents = () => {
	/**
	 * Sends an event to all connected clients
	 * @param data The data to send to the client
	 */
	const send = (data: ServerSentEvent | string) => {
		const id = Date.now();
		for (const client of clients) {
			sendData(id, client, data);
		}
	};

	/**
	 * Sends and event to a single client
	 * @param clientId The id of the client to send to. This is the id set using usingServerEventsClient()
	 * @param data The data to send to the client
	 */
	const sendSingle = (clientId: any, data: ServerSentEvent | string) => {
		const client = clients.find((c) => c.id === clientId);
		if (client) {
			const id = Date.now();
			sendData(id, client, data);
		}
	};

	const sendData = (id: number, client: Client, data: ServerSentEvent | string) => {
		client.response.write(`id: ${id}\n`);
		if (typeof data === 'string') client.response.write(`data: ${JSON.stringify(data)}\n\n`);
		else if (isServerSentEvent(data)) {
			client.response.write(`data: ${JSON.stringify(data.data)}\n`);
			if (data.event) client.response.write(`event: ${data.event}\n`);
			if (data.retry) {
				client.response.write(`retry: ${data.retry}\n`);
			}
			client.response.write('\n');
		}
		client.response.flushHeaders();
	};

	/**
	 * This is used internally to register clients, but can be used to manually add an EventSource client
	 * @param client
	 */
	const addClient = (client: Client) => {
		if (!clients.includes(client)) {
			clients.push(client);
		}
	};

	/**
	 * Closes the client connection to the server
	 * @param res
	 */
	const close = (res: ServerResponse<IncomingMessage>) => {
		clients = clients.filter((client) => client.response !== res);
		res.end();
	};

	return { send, sendSingle, addClient, close };
};
