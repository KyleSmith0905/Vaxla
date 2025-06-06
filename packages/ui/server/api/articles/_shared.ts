import { readFileSync } from 'fs';
import { resolve } from 'path';

export const parseArticle = (fileName: string) => {
	const articlesPath = resolve(process.env.VAXLA_CONFIG!, 'articles', fileName);

	const file = readFileSync(articlesPath);
	const fileString = file.toString('utf-8');

	const fileParts = fileString.split('---');

	let error: undefined | string = undefined;
	let document = '';
	let metadata: Partial<{ description: string; author: string; title: string }> = {};
	if (fileParts.length > 2) {
		const [_, metadataString, ...documentSplit] = fileParts;

		document = documentSplit.join('---');

		metadataString.split('\n').forEach((line) => {
			const [key, ...valueParts] = line.split(':');
			if (key && valueParts.length > 0) {
				metadata[key.trim() as keyof typeof metadata] = valueParts.join(':').trim();
			}
		});
	} else {
		const [...documentSplit] = fileParts;
		document = documentSplit.join('---');
	}

	const fileNameParts = fileName.split('.');
	let title = '';
	let uploadDate = 0;
	if (fileNameParts.length === 3) {
		const [uploadDateString, titleString, extension] = fileNameParts;

		uploadDate = new Date(uploadDateString).getTime();
		title = titleString;

		if (extension !== 'md') error = 'Please end your article file name with `.md`.';
	} else {
		title = fileName;
		const date = new Date();
		error = `Please follow the format of \`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}\`.<title>.md`;
	}

	return {
		fileName: fileName,
		title: metadata['title'] ?? title,
		metadata: metadata,
		document: document,
		uploadDate,
		error: error,
	};
};
