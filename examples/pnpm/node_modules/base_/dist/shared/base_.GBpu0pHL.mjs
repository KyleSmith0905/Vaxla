import { defineCommand } from 'citty';
import { createJiti } from 'jiti';
import { resolve } from 'path';

const getDefault = (command) => {
  return command.default || command;
};
const commands = {
  dev: () => import('../chunks/dev.mjs').then(getDefault)
};

const name = "base_";
const description = "The CLI behind the BASE_ developer tools.";
const version = "1.0.12";

const defineBaseScoreConfig = (config) => {
  return config;
};
const getBaseScoreConfig = async (path) => {
  const jiti = createJiti(import.meta.url);
  const config = await jiti.import(resolve(path, "config.ts"), { default: true });
  return config;
};

const main = defineCommand({
  meta: {
    name,
    description,
    version
  },
  subCommands: commands
});

export { defineBaseScoreConfig as d, getBaseScoreConfig as g, main as m };
