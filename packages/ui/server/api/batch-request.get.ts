import { sleep } from '~~/shared/timing';

export default defineEventHandler(async (event) => {
	const addresses = getQuery(event).addresses;
	const addressesArr: string[] = Array.isArray(addresses) ? addresses : [addresses];

	const abortController = new AbortController();

	const workingLinks: Record<string, boolean> = Object.fromEntries(addressesArr.map((e) => [e, false]));

	for (const link of addressesArr) {
		$fetch(link, {
			signal: abortController.signal,
		})
			.then((data) => {
				workingLinks[link] = Boolean(data ?? false);
			})
			.catch(() => ({ ok: false }));
	}

	await sleep(500);
	abortController.abort();

	return workingLinks;
});
