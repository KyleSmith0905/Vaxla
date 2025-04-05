import { comm } from 'c';
import { defineCommand } from 'citty';
import { resolve } from 'path';

const dev = defineCommand({
  meta: {
    name: "dev",
    description: "Run BASE_ development server"
  },
  args: {
    port: {
      type: "string",
      description: "The port to run the server on."
    },
    dir: {
      type: "string",
      description: "The path to the base_ files, such as the configuration file.",
      default: "./base_"
    }
  },
  async run({ args }) {
    const { port } = args;
    console.log('waypoint 1')
    const nuxt = await loadNuxt({
      name: "base_ui",
      rootDir: resolve(import.meta.url, "../packages/base_ui"),
      overrides: {
        devServer: {
          port: parseInt(port ?? 3e3)
        }
      }
    });
    console.log('waypoint 2')
    
    await nuxt.ready()
    console.log(nuxt);
    console.log('Server started')

    await new Promise((resolve) => {
      nuxt.hook('close', resolve)
    })
    console.log('closed');
  }
});

export { dev as default };
