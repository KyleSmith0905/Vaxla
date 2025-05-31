# Vaxla

_IN DEVELOPMENT, IGNORE FOR NOW_

A central hub for your development environment. View the documentation at https://vaxla.yskkyle.com/.

## Installation

1. Install with `pnpm i @vaxla/cli`.
2. Make a `vaxla/` directory.
3. Create a `config.ts` inside, and configure it to your environment.
4. Run `vaxla dev --dir ./vaxla`.

## Example

`vaxla/config.ts`

```ts
import { defineVaxlaConfig, colors } from "@vaxla/cli";
import { rmdirSync } from "node:fs";
import { join } from "node:path";

export default defineVaxlaConfig({
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
		},
	},
});
```

## Contributing

```
/examples # Examples experimenting with different use cases
/packages # Source codes for various segments.
  /cli # The CLI commands and binary.
  /doc # The documentation.
  /shared # Shared functions and utilities used by multiple packages.
  /ui # The visual experience of the tool.
  /loading # A screen that appears before the full ui becomes active (Unused now that it loads instantly).
/tools # Developer tools and editor configurations.
  /vaxla # The vaxla monorepo configuration for this workspace (we are using our own tech).
```
