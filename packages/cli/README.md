# Vaxla

_IN DEVELOPMENT, PLEASE BE AWARE OF FAST CHANGES AND LOW STABILITY_

A central hub for your development environment. View the documentation at https://vaxla.yskkyle.com/.

Get started today with `npx @vaxla/cli start`

## Full Installation

1. Install with `npm i @vaxla/cli`.
2. Make a `vaxla/` directory.
3. Create a `config.ts` inside, and configure it to your environment.
4. Run `vaxla start`.

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
					icon: "lucide:cloud",
				},
				{
					id: "deploy",
					label: "Deploy App",
					command: async () => {
						// Deploys the app
					},
					icon: "lucide:upload",
				},
			],
		},
	},
});
```

Run `vaxla start` to start a visual workspace manager for Vaxla.

You can also run `vaxla run mobile deploy` or `vx run mobile deploy` to run the deploy script.

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
