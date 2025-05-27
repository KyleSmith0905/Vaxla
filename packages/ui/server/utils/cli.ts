import { ChildProcess } from 'child_process';

export const activeProcesses: Record<string, ChildProcess> = {};
