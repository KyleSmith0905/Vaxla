import { defineVaxlaConfig, colors } from '@vaxla/cli';

export default defineVaxlaConfig({
  port: 3001,
  packages: {
    shared: {
      name: 'Vaxla Shared',
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
      name: 'Vaxla CLI',
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
      name: 'Vaxla Documentation',
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