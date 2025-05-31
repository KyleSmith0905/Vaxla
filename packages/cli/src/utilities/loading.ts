import { createServer } from 'http';
import { dirname, resolve } from 'path';
import { consola } from './consola';
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import open from 'open';
import { colors } from 'consola/utils';

const require = createRequire(import.meta.url);

export const startLoadingServer = (port: number | string, options: { open: boolean }): { close: () => void } => {
	const loadingPath = dirname(require.resolve('@vaxla/loading/package.json'));

	const file = readFileSync(resolve(loadingPath, './dist/index.html'));
	const server = createServer((_, res) => {
		res.end(file);
	});
	server.listen(port, () => {
		consola.info(`Server will be ready at ${colors.blueBright(colors.underline(`http://localhost:${port}`))}`);

		if (options.open) {
			open(`http://localhost:${port}`);
		}
	});

	return {
		close: () => server.close(),
	};
};
