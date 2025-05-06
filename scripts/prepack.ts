import { version } from "../package.json";
import { globSync, readFileSync, writeFileSync } from "node:fs";

const copyPackageVersions = () => {
  const packageFiles = globSync("packages/*/package.json");

  for (const packageFile of packageFiles) {
    const packageJson = JSON.parse(readFileSync(packageFile, "utf-8"));
    packageJson.version = version;
    writeFileSync(packageFile, JSON.stringify(packageJson, null, 2) + "\n");
  }
};

const copyPackageReadMe = () => {
  const readmeFiles = globSync("packages/*/README.md");

  const rootReadmeFile = readFileSync("./README.md");

  for (const readmeFile of readmeFiles) {
    writeFileSync(readmeFile, rootReadmeFile);
  }
};

copyPackageVersions();
copyPackageReadMe();
