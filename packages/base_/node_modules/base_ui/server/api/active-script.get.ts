import { activeScripts } from "../utils/package";

export default defineEventHandler(async () => {
  return {scripts: activeScripts};
});