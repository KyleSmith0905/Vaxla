import fs from "fs-extra";
import { join } from "path";

/**
 * Returns the path to a file or directory from the shared folder.
 */
export const getPath = (path: string) => {
  let absolutePath = process.cwd();
  if (absolutePath.endsWith("scripts")) absolutePath = join(absolutePath, "..");

  return join(absolutePath, path);
};

/**
 * Makes an empty directory only if it doesn't exist.
 */
export const makePlaceholderDirectory = async (path: string) => {
  const doesExist = await fs.pathExists(path);
  if (!doesExist) {
    return fs.mkdir(path);
  }
};
