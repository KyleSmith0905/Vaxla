import { createJiti } from 'jiti';
import { resolve } from 'path';
import { cwd } from 'process';

/**
 * Color palette template based around TailwindCSS colors.
 */
export type BaseScoreColor = {
  "50": string;
  "100": string;
  "200": string;
  "300": string;
  "400": string;
  "500": string;
  "600": string;
  "700": string;
  "800": string;
  "900": string;
  "950": string;
};


export enum BaseScoreScriptType {
  /** Creates a public endpoint that persists, such as running a web server. */
  Serve = "serve",
  /** One-time temporary action, such as packaging an app. */
  Execute = "execute",
  /** Creates a private server that persists, such as watching a shared package. */
  Daemon = "daemon",
}

type BaseScoreConfig = {
  port?: number;
  packages: Record<
    string,
    {
      name: string;
      color?: BaseScoreConfig;
      link?: { port: number; name: string; path?: string }[];
      scripts: {
        label: string;
        command: string;
        type: BaseScoreScriptType;
        icon: string;
      }[];
    }
  >,
}

const defineBaseScoreConfig = (config: BaseScoreConfig) => {
  return config;
}

const getBaseScoreConfig = async (path: string): Promise<BaseScoreConfig> => {
  const jiti = createJiti(import.meta.url);
  const config = await jiti.import(resolve(path, 'config.ts'), {default: true});
  return config as BaseScoreConfig;
}

export { defineBaseScoreConfig, getBaseScoreConfig };