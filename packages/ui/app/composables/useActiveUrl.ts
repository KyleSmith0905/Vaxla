import { useDocumentVisibility, useIntervalFn } from '@vueuse/core';

const sites = ref<Record<string, { sites: Record<string, boolean> }>>({});

const documentVisibility = useDocumentVisibility();
useIntervalFn(() => queryPages(), 1000);

const queryPages = async () => {
	if (!documentVisibility.value) return;

	// Retrieves a list of sites to fetch
	const siteAddresses: string[] = [];
	for (const sitePackage of Object.values(sites.value)) {
		for (const site of Object.keys(sitePackage.sites)) {
			siteAddresses.push(site);
		}
	}

	if (siteAddresses.length <= 0) return;

	const result = await $fetch('/api/batch-request', { query: { addresses: siteAddresses } });

	const newSite: typeof sites.value = {};
	for (const [packageId, sitePackage] of Object.entries(sites.value)) {
		newSite[packageId] = { sites: {} };

		for (const siteId of Object.keys(sitePackage.sites)) {
			newSite[packageId].sites[siteId] = result[siteId] ?? false;
		}
	}
	sites.value = newSite;
};

export const useActiveUrl = (options: { sites?: string[]; id: string }) => {
	sites.value[options.id] = {
		sites: Object.fromEntries(options.sites?.map((e) => [e, false]) ?? []),
	};

	onUnmounted(() => {
		delete sites.value[options.id];
	});

	const site = computed(() => sites.value[options.id]?.sites);

	return { sites: site };
};
