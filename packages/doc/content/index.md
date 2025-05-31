---
title: Home
navigation: false
---

::hero-alt

#title
[\> Vaxla ./]{class="font-mono"}

#description
Development tool to manage complex developer environments and run commands. A UI for your CLI.
::

::div{class="border rounded-lg shadow-md mt-4"}
:img{src="https://vaxla.yskkyle.com/screenshots/demo.png" height="1280" width="800" class="w-full"}
::

::code-tree{defaultValue="vaxla/config.ts" title="Sample Workspace powered by Vaxla"}

```[apps/mobile]

```

```[apps/web]

```

```[packages/shared]

```

```ts [vaxla/config.ts]
import { defineVaxlaConfig, colors } from '@vaxla/cli';
import { rmdirSync } from 'node:fs';
import { join } from 'node:path';

export default defineVaxlaConfig({
  port: 3000,
  packages: {
    mobile: {
      name: 'Mobile',
      path: './apps/mobile',
      color: colors.red,
      link: [
        {
          port: 5174,
          name: 'Development Server',
        },
        {
          port: 4174,
          name: 'Preview Server',
        },
      ],
      scripts: [
        {
          command: {package: true, npm: 'dev'},
          icon: 'lucide:code-xml',
        },
        {
          label: "build",
          command: {package: true, shell: 'pnpm run build'},
          icon: "lucide:hammer",
        },
        {
          label: "preview",
          command: "cd ./apps/mobile && pnpm run preview",
          icon: "lucide:app-window",
        },
      ]
    },
    web: {
      name: 'Web',
      path: './apps/web',
      color: colors.orange,
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
          command: {package: true, npm: 'dev'},
          icon: 'lucide:code-xml',
        },
        {
          label: "build",
          command: {package: true, shell: 'pnpm run build'},
          icon: "lucide:hammer",
        },
      ]
    },
    shared: {
      name: 'Shared',
      path: './packages/shared',
      color: colors.yellow,
      scripts: [
        {
          command: {package: true, npm: 'watch'},
          icon: 'lucide:code-xml',
        },
        {
          label: "build",
          command: {package: true, shell: 'pnpm run build'},
          icon: "lucide:hammer",
        },
        {
          label: 'clear dist'
          command: {
            fn: async () => {
              console.log('1/2 About to clear dist.');
              rmdirSync(join(process.cwd(), './packages/shared/dist'), {recursive: true});
              console.log('2/2 Cleared dist.');
            }
          },
          icon: "hugeicons:folder-remove",
        }
      ]
    }
  }
})
```

```yaml [pnpm-workspace.yaml]
packages:
  - "apps/*"
  - "packages/*"
```

```json [package.json]
{
	"name": "root",
	"scripts": {
		"dev": "vaxla dev ./vaxla/config.ts",
		"build": "vaxla start ./vaxla/config.ts"
	}
}
```

::
