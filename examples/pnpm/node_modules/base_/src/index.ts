import { defineCommand } from "citty";
import { commands } from "./commands";
import { description, version, name } from '../package.json';
export { defineBaseScoreConfig } from './utilities/config';

export const main = defineCommand({
  meta: {
    name: name,
    description: description,
    version: version,
  },
  subCommands: commands,
})
