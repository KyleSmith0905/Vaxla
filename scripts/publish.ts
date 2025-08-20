import { prepack } from "./prepack";
import { readFileSync, writeFileSync } from "fs";
import consola from "consola";
import { bumpVersion, runCommand } from "./utility/shared";
import { getVersions } from "fast-npm-meta";
import { runTest } from "./utility/test";

/**
 * I'm experimenting with this command for a little, eventually I'll add a way to publish to production.
 * This only works on beta versions for now (where the version is in the format x.x.x-beta.x).
 */

let nextVersion: string | undefined;

const optionPrompts = async () => {
  const latestVersion = await getVersions("@vaxla/cli");
  consola.info(`Latest version: ${JSON.stringify(latestVersion, null, 2)}`);

  const answer = (await consola.prompt("How should we bump the version?", {
    type: "select",
    options: ["next", "patch", "minor", "major"],
  })) as "next" | "patch" | "minor" | "major";

  const latest =
    Object.entries(latestVersion.time)
      .filter(([name]) => name !== "modified" && name !== "created")
      .sort(([, aTime], [, bTime]) => {
        return (
          new Date(bTime as string).getTime() -
          new Date(aTime as string).getTime()
        );
      })[0]?.[0] ?? "0.0.0";

  nextVersion = bumpVersion(latest, answer);

  if (answer !== "next") {
    const confirmation = await consola.prompt(
      `Are you sure you want to publish version ${nextVersion}?`,
      {
        type: "confirm",
      },
    );
    if (!confirmation) {
      consola.error("Publish cancelled.");
      process.exit(1);
    }
  }

  consola.info(`Publishing to version ${nextVersion}...`);
};

const build = async () => {
  consola.start("Building packages...");
  await runCommand("pnpm run build", {}, true);
  consola.success("Packages built successfully.");
};

const propagateVersion = () => {
  consola.info("Bumping versions...");
  const packageJson = readFileSync("./package.json", "utf-8");
  const parsedPackageJson = JSON.parse(packageJson);

  parsedPackageJson.version = nextVersion;
  consola.success(`Bumped version to ${nextVersion}.`);
  writeFileSync("./package.json", JSON.stringify(parsedPackageJson, null, 2));
};

const npmUpload = async () => {
  consola.start("Publishing to NPM...");
  await runCommand(
    "pnpm publish --recursive --no-git-check --tag next",
    {},
    true,
  );
  consola.success("Published to NPM successfully.");
};

const publish = async () => {
  await optionPrompts();

  propagateVersion();
  await build();
  prepack();
  await runTest();
  await npmUpload();
  consola.success("Publish successful.");
};

// Run the script if executed directly
if (require.main === module) {
  publish();
}
