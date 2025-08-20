import { runCommand } from "./shared";
import consola from "consola";

export const runTest = async () => {
  consola.start("Running tests...");
  try {
    await runCommand("pnpm run test:run", {}, true);
    consola.success("All tests passed!");
  } catch (error) {
    consola.error("Tests failed:", error);
    process.exit(1);
  }
};
