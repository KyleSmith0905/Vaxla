import type { BaseScoreCommand, BaseScoreConfig } from 'base_shared';

export enum ScriptStatus {
	/** The script is closed. This is the default status of a script. */
	Closed = 'closed',
	/**
	 * The script is actively running.
	 * On `serve` types, this will be when the URL is live.
	 * On `daemon` and `execute` types, this will be active for a few seconds after success.
	 */
	Opened = 'opened',
}

export type ActiveScript = {
	command: BaseScoreCommand | BaseScoreConfig['packages'][string]['scripts'][number];
	packageId?: string;
	commandIndex?: number;
	id: string;
	status: ScriptStatus;
	logs: { text: string; date: Date; type?: 'error' | 'meta' | 'log' }[];
	createdAt: Date;
};

export type Address = {
	port: number;
	/** The path of the ping address, remove the initial `/`. */
	path?: string;
};
