import { getVaxlaConfig } from '@vaxla/shared';

export default defineEventHandler(async () => {
	const configPath = process.env.VAXLA_CONFIG;

	if (!configPath) {
		throw createError({
			statusCode: 500,
			statusMessage: 'VAXLA_CONFIG is not set',
		});
	}

	const config = await getVaxlaConfig(configPath);

	return { config };
});
