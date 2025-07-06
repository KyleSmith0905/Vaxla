import { exec, ExecOptions } from "node:child_process";
import consola from "consola";
import { colors } from "consola/utils";

export const runCommand = (
  command: string,
  options?: { cwd?: string; env?: Record<string, string> },
  debug?: boolean,
) => {
  return new Promise<void>((resolve, reject) => {
    const log = (message: string) => {
      process.stdout.write(`${colors.dim(message.trim())}\n`);
    };

    if (debug) log(colors.yellow(`╭────${command}─────`));

    const env: NodeJS.ProcessEnv = { ...process.env, ...options?.env };

    const execOptions: ExecOptions = { env };
    if (options?.cwd) execOptions.cwd = options.cwd;

    const child = exec(command, execOptions);

    if (debug) {
      child.stdout?.on("data", (data) => {
        data
          .toString()
          .split("\n")
          .forEach((e: string) => {
            if (!e) return;
            log(`${colors.yellow("│")} ${e}`);
          });
      });

      child.stderr?.on("data", (data) => {
        data
          .toString()
          .split("\n")
          .forEach((e: string) => {
            if (!e) return;
            log(`${colors.yellow("│")} ${e}`);
          });
      });
    }

    child.on("error", (error) => {
      consola.error(`Failed to start child process: ${error.message}`);
      reject(error);
    });

    child.on("close", () => {
      if (debug) log(colors.yellow(`╰────${command}─────`));
      resolve();
    });
  });
};

export const bumpVersion = (
  version: string,
  type: "major" | "minor" | "patch" | "next",
) => {
  const [major, minor, patch, preRelease] = version.split(".");

  let newVersion = version;

  if (type === "major") {
    newVersion = `${parseInt(major ?? "0") + 1}.0.0`;
  } else if (type === "minor") {
    newVersion = `${major}.${parseInt(minor ?? "0") + 1}.0`;
  } else if (type === "patch") {
    newVersion = `${major}.${minor}.${parseInt(patch ?? "0") + 1}`;
  } else if (type === "next") {
    const newPreRelease = preRelease
      ? `${preRelease.split(".")[0]}.${parseInt(preRelease.split(".")[1] ?? "0") + 1}`
      : "next.1";

    newVersion = `${major}.${minor}.${patch}-${newPreRelease}`;
  }

  return newVersion;
};
