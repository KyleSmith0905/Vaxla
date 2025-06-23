import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createJiti } from "jiti";
import type { VaxlaConfig } from "./types";
import { findUpSync } from "find-up";
import { existsSync } from "node:fs";

export const getVaxlaConfig = async (configPath: string) => {
  const contextPath = findUpSync("package.json", { cwd: configPath });
  if (!contextPath)
    throw new Error(`Could not find closest package.json to ${configPath}.`);

  const jiti = createJiti(pathToFileURL(resolve(contextPath, "..")).href, {
    debug: true,
  });

  let configFile = resolve(configPath, "config.json");
  if (!existsSync(configFile)) configFile = resolve(configPath, "config.ts");

  const configurationFileUrl = pathToFileURL(configFile).toString();

  const config = (await jiti.import(configurationFileUrl)) as {
    default: VaxlaConfig;
  };

  return config.default;
};
