import { ConsolaInstance, createConsola } from 'consola';
import { box, colors } from 'consola/utils';

export const consola = createConsola() as unknown as Omit<ConsolaInstance, 'box'> & { box: typeof box };
consola.box = (...args: Parameters<typeof box>) => {
	const output = box(...args);
	process.stdout.write(output);
	return output;
};

let currentTitle = '';

export const startLog = (title: string) => {
	const log = (message: string) => {
		process.stdout.write(`${colors.dim(message.trim())}\n`);
	};

	const startLog = () => log(colors.yellow(`╭────${title}─────`));
	const endLog = () => log(colors.yellow(`╰────${title}─────`));

	return {
		/**
		 * Rarely needed, usually just run the `log` function and a header will be automatically added.
		 */
		start: () => {
			startLog();
			currentTitle = title;
		},
		log: (data: string) => {
			if (currentTitle !== title) {
				if (currentTitle !== '') endLog();
				startLog();
				currentTitle = title;
			}

			data.split('\n').forEach((e: string) => {
				if (!e) return;
				log(`${colors.yellow('│')} ${e}`);
			});
		},
		error: (data: string) => {
			if (currentTitle !== title) {
				if (currentTitle !== '') endLog();
				startLog();
				currentTitle = title;
			}

			data.split('\n').forEach((e: string) => {
				if (!e) return;
				log(`${colors.red('│')} ${e}`);
			});
		},
		/**
		 * Signifies an end to a log.
		 */
		end: () => {
			endLog();
			currentTitle = '';
		},
	};
};
