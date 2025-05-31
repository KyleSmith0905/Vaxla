import type { VaxlaConfig } from '@vaxla/shared';

const config = ref<VaxlaConfig | null>(null);

export const useVaxlaConfig = async () => {
	const hydrateConfig = async () => {
		if (config.value) return;
		config.value = await $fetch('/api/config').then((e) => e.config as VaxlaConfig);
	};

	await hydrateConfig();

	return config as Ref<VaxlaConfig>;
};
