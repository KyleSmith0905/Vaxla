import { activeProcesses } from "../utils/cli";

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as {id: string};

  if (activeProcesses[body.id]) activeProcesses[body.id]?.kill();
  else throw createError({statusCode: 400, statusMessage: `Could not find script by id "${body.id}".`});

  return {};
})