import { exec } from "child_process";
import { existsSync, writeFileSync, readFileSync } from "fs";

const ERROR = "\x1b[1m\x1b[31m%s\x1b[0m";
const WARNING = "\x1b[1m\x1b[33m%s\x1b[0m";
const SUCCESS = "\x1b[1m\x1b[32m%s\x1b[0m";
const VERBOSE = "\x1b[36m%s\x1b[0m";
const VERBOSE_SEPARATOR = "-===- -===- -===- -===- -===-";
const PACKAGE_JSON = "./package.json";
const OUTPUT_VERSION = "./.output/version";
const OUTPUT_NITRO_JSON = "./.output/nitro.json";

const verbose = true;

const stripColorCodes = (str: string) => str.replace(/\x1b\[[0-9;]*m/g, "");

const log = {
  verbose: (message: any) => {
    if (verbose) console.log(VERBOSE, stripColorCodes(message.trim()));
  },
  success: (message: any) => {
    console.log(SUCCESS, stripColorCodes(message.trim()));
  },
  warning: (message: any) => {
    console.log(WARNING, stripColorCodes(message.trim()));
  },
  error: (message: any) => {
    console.log(ERROR, stripColorCodes(message.trim()));
  },
};

/**
 * Install node modules if node_modules is not found.
 */
const install = async () => {
  if (!existsSync("./node_modules")) {
    log.warning("No node_modules detected, installing external packages.");
    const installProcess = exec("pnpm i");

    log.verbose(VERBOSE_SEPARATOR);
    installProcess.stdout?.addListener("data", (message) =>
      log.verbose(message),
    );
    await new Promise<void>((resolve) =>
      installProcess.addListener("exit", () => resolve()),
    );
    log.verbose(VERBOSE_SEPARATOR);

    log.success("Packages successfully installed.");
  } else log.success("Packages installed, bypassing installation step.");
};

/**
 * Build app if new release of the app is available
 */
const build = async () => {
  const packageJson = readFileSync(PACKAGE_JSON, "utf8");
  const packageVersion = JSON.parse(packageJson).version;
  const outputVersion = existsSync(OUTPUT_VERSION)
    ? readFileSync(OUTPUT_VERSION, "utf-8")
    : undefined;

  if (!existsSync(OUTPUT_NITRO_JSON) || outputVersion !== packageVersion) {
    if (!outputVersion)
      log.warning("No production application detected, building project.");
    else
      log.warning(
        `Version current ${outputVersion} does not match package.json version ${packageVersion}, updating project.`,
      );
    const buildProcess = exec("pnpm run build");

    log.verbose(VERBOSE_SEPARATOR);
    buildProcess.stdout?.addListener("data", (message) => log.verbose(message));
    buildProcess.stderr?.addListener("data", (message) => log.error(message));
    await new Promise<void>((resolve) =>
      buildProcess.addListener("exit", () => resolve()),
    );
    log.verbose(VERBOSE_SEPARATOR);

    if (!outputVersion) log.success("Production build built.");
    else log.success("Production build updated.");

    writeFileSync(OUTPUT_VERSION, packageVersion);
  } else log.success("Production build found and on valid version.");
};

const main = async () => {
  await install();
  await build();

  // Runs app and previews it in the browser
  log.success("Starting welcome server.");
  const previewProcess = exec("pnpm run preview");

  log.verbose(VERBOSE_SEPARATOR);
  previewProcess.stdout?.addListener("data", (message) => log.verbose(message));
  previewProcess.stderr?.addListener("data", (message) => log.error(message));

  let abortController = new AbortController();
  await new Promise<void>((resolve) => {
    const query = async () => {
      abortController.abort("");
      abortController = new AbortController();
      const response = await fetch("http://localhost:3000/", {
        signal: abortController.signal,
      }).catch(() => null);
      if (response) resolve();
    };
    setInterval(() => query(), 500);
    query();
  });

  const { openApp } = await import("open");
  openApp("http://localhost:3000/");
  log.verbose(VERBOSE_SEPARATOR);
  log.success("App running through http://localhost:3000.");
  log.verbose(VERBOSE_SEPARATOR);
};

main();
