import { useLocalStorage } from '@vueuse/core';

const settings = {
	homeDisplay: 'compact' as 'detailed' | 'compact',
};

export const useSettings = <T extends keyof typeof settings>(key: T) => {
	const value = useLocalStorage<(typeof settings)[T]>(key, settings[key], { initOnMounted: true });

	return { value };
};
