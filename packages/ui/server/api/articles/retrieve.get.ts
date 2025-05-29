import { parseArticle } from './_shared';

export default defineEventHandler(async (event) => {
	const fileName = getQuery<{ fileName: string }>(event).fileName;
	const parsedArticle = parseArticle(fileName);
	return parsedArticle;
});
