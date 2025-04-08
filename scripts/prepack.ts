import { version } from "../package.json";
import {globSync, readFileSync, writeFileSync} from 'node:fs';

const updatePackageVersions = () => {
  const packageFiles = globSync('packages/*/package.json');
  
  for (const packageFile of packageFiles) {
    const packageJson = JSON.parse(readFileSync(packageFile, 'utf-8'));
    packageJson.version = version;
    writeFileSync(packageFile, JSON.stringify(packageJson, null, 2) + '\n');
  }
};

updatePackageVersions();