import { defineBuildConfig } from "unbuild";
import { cpSync, writeFileSync } from "fs";
import { exec } from "child_process";

export default defineBuildConfig({
  entries: ["./src/index.ts", "./src/command.ts"],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  hooks: {
    "build:done": async () => {
      cpSync("./dist/", "../ui/.vaxla/shared", { recursive: true });

      // Copies the dependencies over to @vaxla/ui
      const response = exec("pnpm list --prod --json");
      response.stdout?.addListener("data", async (e) => {
        const dependencies = JSON.parse(e)[0].dependencies as Record<
          string,
          { from: string; version: string; path: string }
        >;
        const packageJson = await import("../ui/package.json");

        Object.values(dependencies).forEach((dependency) => {
          (packageJson.default.devDependencies as Record<string, string>)[
            dependency.from
          ] = dependency.version;
        });

        writeFileSync(
          "../ui/package.json",
          JSON.stringify(packageJson.default, null, "\t"),
        );
      });
      await new Promise<void>((resolve) => {
        response.addListener("close", () => resolve());
      });
    },
  },
});
