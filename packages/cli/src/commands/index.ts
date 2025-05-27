import type { CommandDef } from 'citty';

const getDefault = (command: any) => {
	return (command.default || command) as CommandDef;
};

export const commands = {
	run: () => import('./run').then(getDefault),
	start: () => import('./start').then(getDefault),
};
