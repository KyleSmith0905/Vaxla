import { defineCommand } from 'citty';
import { commands } from './commands';
import { description, version, name } from '../package.json';
import colors from 'tailwindcss/colors.js';

export { colors };
export { defineVaxlaConfig } from './utilities/config';
export { type VaxlaConfig, type VaxlaColor } from '@vaxla/shared';

export const main = defineCommand({
	meta: {
		name: name,
		description: description,
		version: version,
	},
	subCommands: commands,
});
