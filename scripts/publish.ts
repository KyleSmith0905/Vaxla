import { prepack } from './prepack';
import { version } from "../package.json";
import { readFileSync, writeFileSync } from 'fs';
import consola from 'consola';
import { runCommand } from './_shared';

/**
 * I'm experimenting with this command for a little, eventually I'll add a way to publish to production.
 * This only works on beta versions for now (where the version is in the format x.x.x-beta.x).
 */

const build = async () => {
  consola.start('Building Packages...');
  await runCommand('pnpm run build', {}, true);
  consola.success('Packages built successfully.');
}

const bumpVersion = () => {
  consola.info('Bumping Versions...');
  const packageJson = readFileSync('./package.json', 'utf-8');
  const parsedPackageJson = JSON.parse(packageJson);

  let newVersion = version;
  if (version.includes('-')) {
    const [baseVersion, preRelease] = version.split('-');
    const [stage, stageNumber] = preRelease!.split('.');
    newVersion = `${baseVersion}-${stage}.${stageNumber ? parseInt(stageNumber) + 1 : 0}`;
  }
  else {
    newVersion = `${version}-beta.0`;
  }
  parsedPackageJson.version = newVersion;
  consola.success(`Bumping version to ${newVersion}.`);
  writeFileSync('./package.json', JSON.stringify(parsedPackageJson, null, 2));
}

const npmUpload = async () => {
  consola.start('Publishing to NPM...');
  await runCommand('pnpm publish --recursive --no-git-check --tag next', {}, true);
  consola.success('Published to NPM successfully.');
}

const publish = async () => {
  bumpVersion();
  await build();
  prepack();
  await npmUpload();
  consola.success('Publish successful.');
}

// Run the script if executed directly
if (require.main === module) {
  publish();
}