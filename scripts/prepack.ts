import { readFileSync, writeFileSync } from "node:fs";
import { consola } from 'consola';
import { globSync } from 'glob';

export const copyPackageVersions = () => {
  consola.info("Copying root package version to packages...");
  const packageFiles = globSync("packages/*/package.json");

  const packageJson = readFileSync('./package.json', 'utf-8');
  const parsedPackageJson = JSON.parse(packageJson);

  for (const packageFile of packageFiles) {
    const packageJson = JSON.parse(readFileSync(packageFile, "utf-8"));
    packageJson.version = parsedPackageJson.version;
    writeFileSync(packageFile, JSON.stringify(packageJson, null, 2) + "\n");
  }
  consola.success(`Successfully copied root package versions.`);
};

export const copyPackageReadMe = () => {
  consola.info("Copying root README to packages...");
  const readmeFiles = globSync("packages/*/README.md");

  const rootReadmeFile = readFileSync("./README.md");

  for (const readmeFile of readmeFiles) {
    writeFileSync(readmeFile, rootReadmeFile);
  }
  consola.success(`Successfully copied README.`);
};

export const prepack = () => {
  copyPackageVersions();
  copyPackageReadMe();
}

// Run the script if executed directly
if (require.main === module) {
  prepack();
}
