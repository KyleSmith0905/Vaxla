import fkill from 'fkill';

export default defineEventHandler(async (event) => {
  const processId = parseInt(getQuery<{process: string}>(event).process);
  const signal = getQuery<{signal: "SIGKILL" | "SIGTERM"}>(event).signal;

  return fkill(processId, {force: signal === 'SIGKILL', tree: true});
})