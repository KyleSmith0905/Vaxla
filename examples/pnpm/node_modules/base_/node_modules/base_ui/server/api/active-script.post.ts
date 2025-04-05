import { setActiveScripts } from '../utils/package';
import { ActiveScript } from "~/utils/packages/types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as {scripts: ActiveScript[]};
  setActiveScripts(body.scripts);
  return;
});