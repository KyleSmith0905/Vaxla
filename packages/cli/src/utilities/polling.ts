import { ofetch } from 'ofetch';

interface PollOptions {
	/**
	 * The amount of time in milliseconds between each polling request.
	 * @default 1000
	 */
	interval?: number;
	/**
	 * The amount of time in milliseconds before this function expires and throws an error.
	 * Undefined means the polling function will never expire.
	 * @default undefined
	 */
	timeout?: number;
}

export const pollUrl = (url: string, options?: PollOptions): Promise<void> => {
	const { interval = 1000, timeout = undefined } = options || {};

	return new Promise<void>((resolve, reject) => {
		const startTime = Date.now();

		const checkUrl = async () => {
			console.log('CHECKING URL');
			try {
				await ofetch(url);
				resolve();
			} catch (error: any) {
				console.log(error);
				if (timeout && Date.now() - startTime > timeout) {
					reject(new Error(`Polling timed out after ${timeout}ms`));
				} else {
					setTimeout(checkUrl, interval);
				}
			}
		};

		checkUrl();
	});
};
