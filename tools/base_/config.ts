import { defineBaseScoreConfig, colors } from '@base_/cli';

export default defineBaseScoreConfig({
  port: 3001,
  packages: {
    shared: {
      name: 'BASE_ Shared',
      path: './packages/shared',
      color: colors.red,
      scripts: [
        {
          command: {package: true, npm: 'build'},
          icon: "lucide:hammer",
        },
      ]
    },
    cli: {
      name: 'BASE_ CLI',
      path: './packages/cli',
      color: colors.orange,
      scripts: [
        {
          command: {package: true, npm: 'build'},
          icon: "lucide:hammer",
        },
      ]
    },
    doc: {
      name: 'BASE_ Documentation',
      path: './packages/doc',
      color: colors.yellow,
      link: [
        {
          port: 3000,
          name: 'Development Server',
        },
      ],
      scripts: [
        {
          command: {package: true, npm: ' '},
          icon: 'lucide:code-xml',
        },
        {
          command: {package: true, npm: 'build'},
          icon: "lucide:hammer",
        },
      ]
    }
  }
})