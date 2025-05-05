import { defineBaseScoreConfig, colors } from '@base_/cli';
import { rmdirSync } from 'node:fs';
import { join } from 'node:path';

export default defineBaseScoreConfig({
  port: 3000,
  packages: {
    viteVanillaTs: {
      name: 'Vite Vanilla TS',
      path: './apps/vite-vanilla-ts',
      color: colors.red,
      link: [
        {
          port: 5173,
          name: 'Development Server',
        },
        {
          port: 4173,
          name: 'Preview Server',
        },
      ],
      scripts: [
        {
          command: {package: true, npm: 'dev'}, // cd ./apps/vite-vanilla-ts && pnpm run dev
          icon: 'lucide:code-xml',
        },
        {
          label: "build",
          command: {package: true, shell: 'pnpm run build'}, // cd ./apps/vite-vanilla-ts && pnpm run build
          icon: "lucide:hammer",
        },
        {
          label: "preview",
          command: "cd ./apps/vite-vanilla-ts && pnpm run preview", // cd ./apps/vite-vanilla-ts && pnpm run preview
          icon: "lucide:app-window",
        },
        {
          command: {
            fn: async () => {
              console.log('1/2 About to clear dist.');
              rmdirSync(join(process.cwd(), './apps/vite-vanilla-ts/dist'), {recursive: true});
              console.log('2/2 Cleared dist.');
            }
          },
          icon: "hugeicons:folder-remove",
        }
      ]
    },
  }
})