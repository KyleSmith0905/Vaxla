/**
 * Color palette template based around TailwindCSS colors.
 */
export type VaxlaColor = {
	'50': string;
	'100': string;
	'200': string;
	'300': string;
	'400': string;
	'500': string;
	'600': string;
	'700': string;
	'800': string;
	'900': string;
	'950': string;
};

export type VaxlaCommand = string
	| {
		/** Whether the command should be run inside the package path. */
		package?: boolean;
		/** The npm command to run. */
		npm: string;
	}
	| {
		/** Whether the command should be run inside the package path. */
		package?: boolean;
		/** The shell command to run. */
		shell: string;
	}
	| {fn: (() => Promise<void>)};

export type VaxlaConfig = {
	port?: number;
	externalLinks?: Record<string, {
		icon?: string;
		name?: string;
		href: string;
	}>
	packages: Record<
		string,
		{
			/** The display name for the package. */
			name?: string;
			/** The path to the package's directory, inside should be a package.json file. */
			path?: string;
			/** A color for the package, to help identify it in the UI. */
			color?: VaxlaColor;
			/** Links to localhost servers, relevant to the package (development server, test preview, etc). */
			link?: Record<string, {
				/** A name to identify the link. */
				name: string;
				/** The port of the website, `http://localhost:{port}`. */
				port: number;
				/** The path to poll and send the user to on the website. */
				path?: string;
			}>;
			/** Scripts associated with the package. */
			scripts: Record<string, {
				/** The display label for the script ("dev", "build", "preview", etc). */
				label?: string;
				/**
				 * The command to run for the script.
				 * 
				 * @example
				 * ```
				 * // Inferred usage
				 * "command": "cd ./apps/example-app && pnpm run dev" // Runs a shell command inside the root.
				 * "command": async () => dev("app") // Runs a function.
				 * 
				 * // Object usage
				 * "command": {shell: "cd ./apps/example-app && pnpm run dev"} // Runs a shell command inside the root.
				 * "command": {npm: "example-app:dev"} // Runs an npm command inside the root.
				 * "command": {package: true, shell: "pnpm run dev"} // Runs a shell command inside the package path.
				 * "command": {package: true, npm: "dev"} // Runs an npm command inside the package path.
				 * ```
				 */
				command: VaxlaCommand;
				/** An iconify icon to display on the script button. */
				icon?: string;
			}>;
		}
	>;
};
