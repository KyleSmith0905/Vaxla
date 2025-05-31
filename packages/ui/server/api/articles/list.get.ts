import { readdirSync } from 'fs';
import { resolve } from 'path';
import { parseArticle } from './_shared';

export default defineEventHandler(async () => {
	const articlesPath = resolve(process.env.VAXLA_CONFIG!, 'articles');
	const articles = readdirSync(articlesPath);

	const parsedArticles = articles.map(parseArticle);
	return { articles: parsedArticles };
});
