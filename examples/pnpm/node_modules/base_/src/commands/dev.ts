import { runCommand } from 'nuxi';
import { defineCommand } from 'citty';
import { getBaseScoreConfig } from '../utilities/config';
import { dirname } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default defineCommand({
  meta: {
    name: "dev",
    description: "Run BASE_ development server",
  },
  args: {
    port: {
      type: 'string',
      description: 'The port to run the server on.',
    },
    dir: {
      type: 'string',
      description: 'The path to the base_ files, such as the configuration file.',
      default: './base_',
    },
  },
  async run({ args }) {
    const { port, dir } = args;

    const config = await getBaseScoreConfig(dir);
    
    const finalPort = port ?? config.port ?? 3000;
    
    // Find the actual location of base_ui package
    const baseUiPath = dirname(require.resolve('base_ui/package.json'));
    
    await runCommand('dev', ['--port', finalPort, '--cwd', baseUiPath]);
  }
});