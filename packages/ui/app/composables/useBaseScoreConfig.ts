import type { BaseScoreConfig } from '@base_/shared';

const config = ref<BaseScoreConfig | null>(null);

const hydrateConfig = async () => {
	config.value = await $fetch('/api/config');
};

hydrateConfig();

export const useBaseScoreConfig = () => {
	return config.value as BaseScoreConfig;
};
