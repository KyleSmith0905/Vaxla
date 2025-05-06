import { ConsolaInstance, createConsola } from 'consola';
import { box } from 'consola/utils';

const consola = createConsola() as unknown as Omit<ConsolaInstance, 'box'> & { box: typeof box };
consola.box = (...args: Parameters<typeof box>) => {
	const output = box(...args);
	process.stdout.write(output);
	return output;
};

export { consola };
