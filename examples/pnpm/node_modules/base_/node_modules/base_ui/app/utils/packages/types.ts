export enum ScriptStatus {
  /** The script is closed. This is the default status of a script. */
  Closed = "closed",
  /**
   * The script is actively running.
   * On `serve` types, this will be when the URL is live.
   * On `daemon` and `execute` types, this will be active for a few seconds after success.
   */
  Opened = "opened",
}

export enum ScriptType {
  /** Creates a public endpoint that persists, such as running a web server. */
  Serve = "serve",
  /** One-time temporary action, such as packaging an app. */
  Execute = "execute",
  /** Creates a private server that persists, such as watching a shared package. */
  Daemon = "daemon",
}

export type Script = {
  label: string;
  command: string;
  type: ScriptType;
  /** For consistency we are generally using {@link https://icon-sets.iconify.design/lucide/page-27.html Lucide Icons}. */
  icon: string;
};

export type ActiveScript = {
  command: string;
  id: string;
  status: ScriptStatus;
  logs: { text: string; date: Date, type?: 'error' | 'meta' | 'log'}[];
  createdAt: Date;
};

export type Address = {
  port: number;
  /** The path of the ping address, remove the initial `/`. */
  path?: string;
};

export type PackageInfo = {
  name: string;
  color: Record<
    | "50"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | "950",
    string
  >;
  id: string;
  /** The Firebase hosting site id. */
  target?: string;
  /** The path to the folder. */
  workspacePath?: string;
  /** The address of the website. */
  address?: Address;
  /** The address to ping to verify it's online. */
  pingAddress?: Address;
};
