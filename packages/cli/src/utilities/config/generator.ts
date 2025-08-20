import { normalizePath, VaxlaConfig, writeFileRecursive } from '@vaxla/shared';
import consola from 'consola';
import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { dirname, relative } from 'path';

type Script = VaxlaConfig['packages'][string]['scripts'][string];
type Handler = (options: { fileContent: string; relativePath: string }) => VaxlaConfig['packages'][string] | null;

export const generateConfig = () => {
	const config = {
		packages: {},
	} as VaxlaConfig;

	const globResult = globSync(['**/package.json', '**/composer.json'], { ignore: ['**/node_modules/**'], absolute: true });
	globResult.map((filePath) => {
		const filePathSplit = normalizePath(filePath).split('/');
		const relativePath = normalizePath(dirname(relative(process.cwd(), filePath)));
		const fileContent = readFileSync(filePath, { encoding: 'utf-8' });

		const fileName = filePathSplit[filePathSplit.length - 1];

		let handler: Handler = () => null;
		if (fileName === 'package.json') handler = handlePackageJson;
		if (fileName === 'composer.json') handler = handleComposerJson;

		const configPackage = handler({ fileContent, relativePath });

		if (!configPackage) return;
		config.packages[relativePath === '.' ? 'root' : relativePath] = configPackage;
	});

	let configString = JSON.stringify(config, null, '\t');
	writeFileRecursive('./.vaxla/configless/config.json', configString);

	try {
		const gitIgnore = readFileSync('./.gitignore', { encoding: 'utf-8' });
		if (!gitIgnore.includes('\n/.vaxla/*')) writeFileSync('./.gitignore', `${gitIgnore}\n# Vaxla Internals\n/.vaxla/*`);
	} catch {
		consola.info('Suggestion: Add /.vaxla/* to .gitignore to prevent committing the configless information.');
	}

	return config;
};

const expandScripts = (scripts: string[], map: (key: string) => Script['command']) => {
	const scriptEntries = Object.keys(scripts).map((key) => {
		return [
			key,
			{
				label: key,
				command: map(key),
			} as Script,
		];
	});

	return Object.fromEntries(scriptEntries);
};

const handlePackageJson: Handler = ({ fileContent, relativePath }) => {
	const packageJson = JSON.parse(fileContent);
	const scripts = expandScripts(packageJson.scripts, (key) => ({ npm: key }));

	return {
		name: packageJson.name ?? (relativePath === '.' ? 'root' : relativePath),
		path: relativePath,
		scripts: scripts,
	};
};

const handleComposerJson: Handler = ({ fileContent, relativePath }) => {
	const packageJson = JSON.parse(fileContent);
	const scripts = expandScripts(packageJson.scripts, (key) => ({ shell: `composer ${key}` }));

	return {
		name: packageJson.name ?? (relativePath === '.' ? 'root' : relativePath),
		path: relativePath,
		scripts: scripts,
	};
};
