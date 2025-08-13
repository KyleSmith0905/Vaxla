const nameMatchMap = {
	build: 'lucide:hammer',
	dev: 'lucide:code-xml',
	debug: 'lucide:bug-play',
	preview: 'lucide:app-window',
	test: 'lucide:test-tube',
	lint: 'lucide:spell-check-2',
	format: 'lucide:baseline',
	start: 'lucide:play',
	clean: 'lucide-lab:broom',
	typescript: 'hugeicons:typescript-01',
	version: 'lucide:git-commit-vertical',
};

/**
 * Passes over an icon, with a backup name to icon converter in case there is no icon.
 */
export const findIcon = (icon: string | undefined, name: string | undefined) => {
	if (icon) return icon;
	// @ts-expect-error We've verified that the `name` exists on `nameMatchMap`
	else if (name && name in nameMatchMap) return nameMatchMap[name];
	else return 'lucide:circle-dashed';
};
