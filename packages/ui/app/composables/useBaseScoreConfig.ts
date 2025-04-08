import type { BaseScoreConfig } from '@base_/shared';

const config = ref<BaseScoreConfig | null>(null);

export const useBaseScoreConfig = async () => {
	const hydrateConfig = async () => {
		if (config.value) return;
		config.value = await $fetch('/api/config').then((e) => e.config as BaseScoreConfig);
	};

	await hydrateConfig();

	return config as Ref<BaseScoreConfig>;
};
