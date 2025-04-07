import { getBaseScoreConfig } from '@base_/shared';

export default defineEventHandler(async () => {
	const configPath = process.env.BASE_SCORE_CONFIG;

	if (!configPath) {
		throw createError({
			statusCode: 500,
			statusMessage: 'BASE_SCORE_CONFIG is not set',
		});
	}

	return { config: await getBaseScoreConfig(configPath) };
});
