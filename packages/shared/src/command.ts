import type { VaxlaConfig, VaxlaCommand } from "./types";

type CommandOptions = 
  /** @deprecated Use `{dynamic: ...}` instead. */
  | {script: VaxlaConfig['packages'][string]['scripts'][number]}
  /** @deprecated Use `{dynamic: ...}` instead. */
  | {command: VaxlaCommand | undefined}
  | {dynamic: VaxlaCommand | VaxlaConfig['packages'][string]['scripts'][number] | undefined}

/**
 * Receives a user-friendly name for the command.
 */
export const getCommandDisplayName = (options: CommandOptions): string => {
  if ('dynamic' in options) {
    if (typeof options.dynamic === 'object' && 'command' in options.dynamic) return getCommandDisplayName({script: options.dynamic});
    else return getCommandDisplayName({command: options.dynamic});
  }

  // Default to use the user-provided label
  if ('script' in options && options.script.label) return options.script.label;
  
  const command = 'command' in options ? options.command : options.script?.command;

  if (typeof command === 'object') {
    if ('npm' in command) return command.npm;
    else if ('shell' in command) return command.shell;
    else return 'Custom Function';
  }
  else return command ?? 'Custom Function';
}

/**
 * Receives a command object and returns a shell command to run it.
 */
export const getCommandShellScript = (options: CommandOptions, packagePath: string): string => {
  if ('dynamic' in options) {
    if (typeof options.dynamic === 'object' && 'command' in options.dynamic) return getCommandShellScript({script: options.dynamic}, packagePath);
    else return getCommandShellScript({command: options.dynamic}, packagePath);
  }

  const command = 'command' in options ? options.command : options.script?.command;

	let shellCommand = '';
	if (typeof command === 'object') {
		if ('package' in command && command.package === true) {
			shellCommand += `cd ${packagePath} && `;
		}

		if ('npm' in command) shellCommand += `npm run ${command.npm}`;
		else if ('shell' in command) shellCommand += command.shell;
		else shellCommand += '::custom_function::';
	}
  else if (typeof command === 'string') shellCommand += command;
  else shellCommand += '::custom_function::';
  
  return shellCommand;
}
