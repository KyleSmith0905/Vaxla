import type { CommandDef } from 'citty';

const getDefault = (command: any) => {
	return (command.default || command) as CommandDef;
};

export const commands = {
	dev: () => import('./dev').then(getDefault),
};
