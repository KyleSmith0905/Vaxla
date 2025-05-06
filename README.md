# BASE_ (pronounced "Base Score")

_IN DEVELOPMENT, IGNORE FOR NOW_

A central base for your development environment. View the documentation at https://base.yskkyle.com/.

## Installation

1. Install with `pnpm i @base_/cli`.
2. Make a `base-score/` or `base_/` directory.
3. Create a `config.ts` inside, and configure it to your environment.
4. Run `base_ dev --dir ./base_`.

## Example

`base-score/config.ts`
```ts
import { defineBaseScoreConfig, colors } from '@base_/cli';
import { rmdirSync } from 'node:fs';
import { join } from 'node:path';

export default defineBaseScoreConfig({
  port: 3000, // Defaults to 3000
  packages: {
    mobile: {
      name: "Mobile",
      color: colors.red,
      link: [{ port: 4000, name: "Local Web Server" }],
      scripts: [
        {
          label: "Start Server",
          command: "start:mobile",
          type: ScriptType.Serve,
          icon: "lucide:cloud",
        },
        {
          label: "Deploy App",
          command: async () => {
            // Deploys the app
          },
          type: ScriptType.Action,
          icon: "lucide:upload",
        },
      ],
    }
  }
})
```

## Contributing

```
/examples # Examples experimenting with different use cases
/packages # Source codes for various segments.
  /cli # The CLI commands and binary.
  /doc # The documentation.
  /shared # Shared functions and utilities used by multiple packages.
  /ui # The visual experience of the tool.
/tools # Developer tools and editor configurations.
  /base_ # The base_ monorepo configuration for this workspace (we are using our own tech).
```