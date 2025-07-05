import {
  ChildProcessWithoutNullStreams,
  spawn,
  SpawnOptionsWithoutStdio,
} from "child_process";
import treeKill from "tree-kill";

export const crossPlatformSpawn = (
  command: string,
  options: SpawnOptionsWithoutStdio,
) => {
  let file = process.platform === "win32" ? "cmd.exe" : "/bin/sh";
  let args =
    process.platform === "win32"
      ? ["/s", "/c", '"' + command + '"']
      : ["-c", command];
  if (process.platform === "win32") {
    options = Object.assign({}, options);
    options.windowsVerbatimArguments = true;
  }

  return spawn(file, args, options);
};

export const spawnWrapper = (
  command: string,
  options?: { cwd?: string; signal?: AbortSignal },
): ChildProcessWithoutNullStreams => {
  return crossPlatformSpawn(command, {
    windowsHide: true,
    shell: false,
    detached: false,
    cwd: options?.cwd,
    signal: options?.signal,
    env: {
      ...process.env,
      FORCE_COLOR: "1",
    },
  });
};

/**
 * A custom command executor with prefix support.
 * Code originated from {@link https://stackoverflow.com/a/46617356/13463861}
 */
export const execCommand = async (
  command: string,
  options?: {
    cwd?: string;
    onLog?: (data: string) => void;
    onError?: (data: string) => void;
    onClose?: (data: number) => void;
    onChildProcessInit?: (childProcess: ChildProcessWithoutNullStreams) => void;
    abortController?: AbortController;
  },
) => {
  const childProcess = spawnWrapper(command, {
    cwd: options?.cwd,
    signal: options?.abortController?.signal,
  });
  options?.onChildProcessInit?.(childProcess);

  // Listen for process termination signals
  process.on("SIGINT", () => {
    console.log("SIGINT");
    treeKill(childProcess.pid!);
  });
  process.on("SIGTERM", () => {
    console.log("SIGTERM");
    treeKill(childProcess.pid!);
  });
  process.on("exit", () => {
    console.log("exit");
    treeKill(childProcess.pid!);
  });

  childProcess.stdout?.on("data", async (data = "") => {
    if (options?.onLog) options.onLog(data.toString("utf8"));
  });

  childProcess.stderr?.on("data", (data = "") => {
    if (options?.onError) options.onError(data.toString("utf8"));
  });

  childProcess.on("exit", (data) => {
    if (options?.onClose) options.onClose(data ?? 0);
  });
};
/**
 * A custom command executor with prefix support.
 * Can be used as a promise if order of commands matters.
 */
export const execCommandPromise = (
  command: Parameters<typeof execCommand>[0],
  options?: Parameters<typeof execCommand>[1],
) => {
  return new Promise<number>((resolve) => {
    execCommand(command, {
      ...(options ?? {}),
      onClose: (data) => {
        resolve(data);
        options?.onClose?.(data);
      },
    });
  });
};
