import { existsSync, statSync } from "fs"

export default defineEventHandler((event) => {
  const {path} = getQuery<{path: string}>(event);
  
  if (!existsSync(path)) return false;
  else if (statSync(path).isDirectory()) return false;
  
  return true;
})