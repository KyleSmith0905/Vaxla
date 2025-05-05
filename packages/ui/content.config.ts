import { defineContentConfig, defineCollection, z } from '@nuxt/content';

export default defineContentConfig({
	collections: {
		articles: defineCollection({
			type: 'page',
			source: { prefix: '/articles', include: 'articles/*.md', cwd: process.env.BASE_SCORE_CONFIG },
			schema: z.object({
				description: z.string(),
				author: z.string(),
			}),
		}),
	},
});
