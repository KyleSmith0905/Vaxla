import { ConsolaInstance, createConsola } from 'consola';
import { box, colors } from 'consola/utils';

export const consola = createConsola() as unknown as Omit<ConsolaInstance, 'box'> & { box: typeof box };
consola.box = (...args: Parameters<typeof box>) => {
	const output = box(...args);
	process.stdout.write(output);
	return output;
};

export const startLog = (title: string) => {
	const log = (message: string) => {
		process.stdout.write(`${colors.dim(message.trim())}\n`);
	};

	return {
		start: () => {
			log(colors.yellow(`╭────${title}─────`));
		},
		log: (data: string) => {
			data.split('\n').forEach((e: string) => {
				if (!e) return;
				log(`${colors.yellow('│')} ${e}`);
			});
		},
		error: (data: string) => {
			data.split('\n').forEach((e: string) => {
				if (!e) return;
				log(`${colors.red('│')} ${e}`);
			});
		},
		end: () => {
			log(colors.yellow(`╰────${title}─────`));
		},
	};
};
